package com.example.demo;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.demo.dto.ProductDTO;

@RestController
@RequestMapping("/api/products")
//@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductRepository productRepo;

    /* =====================
       PUBLIC
    ===================== */

    // test endpoint to isolate entity/DB issues
    @GetMapping("/test")
    public List<Map<String, Object>> getTestProducts() {
        try {
            Map<String, Object> testProduct = new HashMap<>();
            testProduct.put("id", 999L);
            testProduct.put("name", "Test Product");
            testProduct.put("price", 19.99);
            testProduct.put("slug", "test-product");
            testProduct.put("category", "Test");
            testProduct.put("imageUrl", "https://via.placeholder.com/150");
            testProduct.put("images", List.of(Map.of("id", 1L, "image", "https://via.placeholder.com/150")));
            testProduct.put("sizes", List.of(Map.of("id", 1L, "size", "M")));
            testProduct.put("colors", List.of(Map.of("id", 1L, "color", "Red")));
            return List.of(testProduct);
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }

    // get all active products
    @GetMapping
    public List<ProductDTO> getAllProducts() {
        try {
            return productRepo.findByActiveTrue().stream()
                    .map(ProductDTO::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error fetching active products: " + e.getMessage(), e);
        }
    }


    // get product by slug
    @GetMapping("/slug/{slug}")
    public ProductDTO getProductBySlug(@PathVariable String slug) {
        try {
            Product p = productRepo.findBySlug(slug)
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            return new ProductDTO(p);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error fetching product by slug: " + e.getMessage(), e);
        }
    }


    // get product by id
    @GetMapping("/{id}")
    public ProductDTO getProductById(@PathVariable Long id) {
        try {
            Product p = productRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            return new ProductDTO(p);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error fetching product by id: " + e.getMessage(), e);
        }
    }


    // filter by category
    @GetMapping("/category/{category}")
    public List<ProductDTO> getByCategory(@PathVariable String category){
        try {
            return productRepo.findByCategory(category).stream()
                    .map(ProductDTO::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error fetching products by category: " + e.getMessage(), e);
        }
    }


    // admin view all products (including hidden)
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ProductDTO> getAllProductsAdmin(){
        try {
            return productRepo.findAll().stream()
                    .map(ProductDTO::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error fetching all products for admin: " + e.getMessage(), e);
        }
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