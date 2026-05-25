package com.example.demo.order;

import com.example.demo.Cart;
import com.example.demo.Product;
import com.example.demo.User;
import com.example.demo.CartRepository;
import com.example.demo.ProductRepository;
import com.example.demo.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class OrderService {

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private OrderItemRepository orderItemRepo;

    @Autowired
    private CartRepository cartRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ProductRepository productRepo;



    /* ========================================
       PLACE ORDER (CHECKOUT FROM CART)
    ======================================== */
    @Transactional   
    public Order placeOrder(User user) {

        List<Cart> cartItems = cartRepo.findByUser(user);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();

        order.setUser(user);
        order.setStatus("PLACED");

        List<OrderItem> orderItems = new ArrayList<>();

        double total = 0;



        for (Cart cart : cartItems) {

            Product product = cart.getProduct();

            double price =
                    product.getDiscountPrice() != null
                            ? product.getDiscountPrice()
                            : product.getPrice();



            OrderItem item = new OrderItem();

            item.setOrder(order);

            item.setProduct(product);

            item.setQuantity(cart.getQuantity());

            item.setPrice(price);



            total += price * cart.getQuantity();

            orderItems.add(item);
        }



        order.setItems(orderItems);

        order.setTotalAmount(total);



        Order savedOrder = orderRepo.save(order);

        orderItemRepo.saveAll(orderItems);



        List<Cart> carts = cartRepo.findByUser(user);

        for (Cart c : carts) {
            cartRepo.delete(c);
        }



        return savedOrder;
    }



    /* ========================================
       BUY NOW (DIRECT PURCHASE)
    ======================================== */
    @Transactional  
    public Order buyNow(Long productId, int quantity, User user) {

        Product product = productRepo
                .findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));



        double price =
                product.getDiscountPrice() != null
                        ? product.getDiscountPrice()
                        : product.getPrice();



        Order order = new Order();

        order.setUser(user);

        order.setStatus("PLACED");



        OrderItem item = new OrderItem();

        item.setOrder(order);

        item.setProduct(product);

        item.setQuantity(quantity);

        item.setPrice(price);



        order.setItems(List.of(item));

        order.setTotalAmount(price * quantity);



        return orderRepo.save(order);
    }



    /* ========================================
       CANCEL ORDER
    ======================================== */

    public Order cancelOrder(Long orderId, User user) {

        Order order = orderRepo
                .findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));



        if (!order.getUser().getId().equals(user.getId())) {

            throw new RuntimeException("You cannot cancel another user's order");

        }



        if (!order.getStatus().equals("PLACED")) {

            throw new RuntimeException("Order cannot be cancelled now");

        }



        order.setStatus("CANCELLED");



        return orderRepo.save(order);
    }



    /* ========================================
       ADMIN UPDATE STATUS
    ======================================== */

    public Order updateStatus(Long orderId, String status) {

        Order order = orderRepo
                .findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));



        order.setStatus(status);



        return orderRepo.save(order);
    }



    /* ========================================
       PAYMENT SUCCESS
    ======================================== */

    @Transactional
    public void markOrderPaid(Long orderId, String paymentId) {

        Order order = orderRepo
                .findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));



        order.setStatus("PAID");

        order.setPaymentId(paymentId);



        orderRepo.save(order);
    }

}