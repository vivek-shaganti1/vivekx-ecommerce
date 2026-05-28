package com.example.demo;

import com.example.demo.dto.CartRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/cart")
@Transactional(readOnly = true)
public class CartController {

    @Autowired
    private CartRepository cartRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ProductRepository productRepo;



    /* =========================================
       HELPER METHOD — GET LOGGED USER
    ========================================= */

    private User getLoggedUser(Authentication auth){

        if(auth == null){
            throw new RuntimeException("Unauthorized - auth is null");
        }

        String email = auth.getName();

        return userRepo
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }



    /* =========================================
       ADD TO CART
    ========================================= */

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(

            @RequestBody CartRequest request,
            Authentication auth

    ){

        User user = getLoggedUser(auth);



        if(request.getQuantity() <= 0){

            return ResponseEntity
                    .badRequest()
                    .body("Quantity must be greater than 0");

        }



        Product product = productRepo
                .findById(request.getProductId())
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));



        Optional<Cart> existingCart =
                cartRepo.findByUserAndProduct(user, product);



        if(existingCart.isPresent()){

            Cart cart = existingCart.get();

            cart.setQuantity(

                    cart.getQuantity()
                            + request.getQuantity()

            );

            cartRepo.save(cart);

        }
        else{

            Cart newCart = new Cart();

            newCart.setUser(user);

            newCart.setProduct(product);

            newCart.setQuantity(request.getQuantity());

            cartRepo.save(newCart);

        }



        return ResponseEntity.ok("Added to cart");
    }



    /* =========================================
       GET MY CART
    ========================================= */

    @GetMapping
    public ResponseEntity<List<Cart>> getMyCart(

            Authentication auth

    ){

        User user = getLoggedUser(auth);

        List<Cart> cartItems =
                cartRepo.findByUser(user);

        return ResponseEntity.ok(cartItems);
    }



    /* =========================================
       UPDATE QUANTITY
    ========================================= */

    @PutMapping("/update/{cartId}")
    public ResponseEntity<?> updateQuantity(

            @PathVariable Long cartId,

            @RequestParam int quantity,

            Authentication auth

    ){

        User user = getLoggedUser(auth);



        if(quantity <= 0){

            return ResponseEntity
                    .badRequest()
                    .body("Quantity must be greater than 0");

        }



        Cart cart = cartRepo
                .findById(cartId)
                .orElseThrow(() ->
                        new RuntimeException("Cart item not found"));



        // SECURITY CHECK
        if(!cart.getUser()
                .getId()
                .equals(user.getId())){

            return ResponseEntity
                    .status(403)
                    .body("You cannot modify another user's cart");

        }



        cart.setQuantity(quantity);

        cartRepo.save(cart);



        return ResponseEntity.ok("Quantity updated");
    }



    /* =========================================
       REMOVE ITEM
    ========================================= */

    @DeleteMapping("/remove/{cartId}")
    public ResponseEntity<?> removeItem(

            @PathVariable Long cartId,

            Authentication auth

    ){

        User user = getLoggedUser(auth);



        Cart cart = cartRepo
                .findById(cartId)
                .orElseThrow(() ->
                        new RuntimeException("Cart item not found"));



        // SECURITY CHECK
        if(!cart.getUser()
                .getId()
                .equals(user.getId())){

            return ResponseEntity
                    .status(403)
                    .body("You cannot delete another user's cart item");

        }



        cartRepo.delete(cart);



        return ResponseEntity.ok("Item removed");
    }

}