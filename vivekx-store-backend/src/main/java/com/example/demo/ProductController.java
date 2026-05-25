package com.example.demo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
//@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductRepository productRepo;

    /* =====================
       PUBLIC
    ===================== */

    // get all active products
    @GetMapping
    public List<Product> getAllProducts() {

        return productRepo.findByActiveTrue();

    }


    // get product by slug
    @GetMapping("/slug/{slug}")
    public Product getProductBySlug(@PathVariable String slug) {

        return productRepo.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Product not found"));

    }


    // get product by id
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {

        return productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

    }


    // filter by category
    @GetMapping("/category/{category}")
    public List<Product> getByCategory(@PathVariable String category){

        return productRepo.findByCategory(category);

    }


    // admin view all products (including hidden)
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Product> getAllProductsAdmin(){

        return productRepo.findAll();

    }


    /* =====================
       ADMIN
    ===================== */

    // add product
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Product addProduct(@RequestBody Product product) {

        // auto slug
        if(product.getSlug() == null || product.getSlug().isEmpty()){

            product.setSlug(

                    product.getName()
                            .toLowerCase()
                            .replace(" ", "-")

            );

        }
        if(product.getProductCode() == null){

            product.setProductCode(
                    CodeGenerator.generateProductCode()
            );

        }

        // default values safety
        if(product.getStock() == 0){

            product.setStock(10);

        }

        product.setActive(true);
        if(product.getImages()!=null)
        	product.getImages().forEach(i -> i.setProduct(product));

        	if(product.getSizes()!=null)
        	product.getSizes().forEach(s -> s.setProduct(product));

        	if(product.getColors()!=null)
        	product.getColors().forEach(c -> c.setProduct(product));

        return productRepo.save(product);

    }


    // update product
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Product updateProduct(@PathVariable Long id,

                                 @RequestBody Product product) {

        Product existing = productRepo

                .findById(id)

                .orElseThrow(() -> new RuntimeException("Product not found"));


        // update fields safely
        existing.setName(product.getName());

        existing.setSlug(product.getSlug());

        existing.setPrice(product.getPrice());

        existing.setDiscountPrice(product.getDiscountPrice());

        existing.setStock(product.getStock());

        existing.setCategory(product.getCategory());

        existing.setDescription(product.getDescription());

        existing.setImageUrl(product.getImageUrl());


     // clear old children safely
        existing.getImages().clear();
        existing.getSizes().clear();
        existing.getColors().clear();


        // IMAGES
        if(product.getImages()!=null){

            for(ProductImage img : product.getImages()){

                img.setId(null); // important
                img.setProduct(existing);

                existing.getImages().add(img);

            }

        }


        // SIZES
        if(product.getSizes()!=null){

            for(ProductSize s : product.getSizes()){

                s.setId(null); // important
                s.setProduct(existing);

                existing.getSizes().add(s);

            }

        }


        // COLORS
        if(product.getColors()!=null){

            for(ProductColor c : product.getColors()){

                c.setId(null); // important
                c.setProduct(existing);

                existing.getColors().add(c);

            }

        }


        existing.setActive(product.isActive());

        return productRepo.save(existing);
    }

    // soft delete (hide product)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteProduct(@PathVariable Long id) {

        Product product = productRepo

                .findById(id)

                .orElseThrow(() -> new RuntimeException("Product not found"));


        product.setActive(false);

        productRepo.save(product);

    }


    // restore deleted product
    @PutMapping("/restore/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Product restoreProduct(@PathVariable Long id){

        Product product = productRepo

                .findById(id)

                .orElseThrow(() -> new RuntimeException("Product not found"));


        product.setActive(true);

        return productRepo.save(product);

    }


    // toggle active / hidden
    @PutMapping("/toggle/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Product toggleProduct(@PathVariable Long id){

        Product product = productRepo

                .findById(id)

                .orElseThrow(() -> new RuntimeException("Product not found"));


        product.setActive(!product.isActive());

        return productRepo.save(product);

    }


    // low stock products
    @GetMapping("/low-stock")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Product> getLowStockProducts(){

        return productRepo.findAll()

                .stream()

                .filter(p -> p.getStock() <= 5)

                .toList();

    }

}