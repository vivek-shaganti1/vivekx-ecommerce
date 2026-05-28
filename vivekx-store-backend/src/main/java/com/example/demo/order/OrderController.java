package com.example.demo.order;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import com.example.demo.UserRepository;
import com.example.demo.User;
import com.example.demo.dto.OrderDTO;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/orders")
@Transactional(readOnly = true)
public class OrderController {

        @Autowired
        private OrderService orderService;

        @Autowired
        private OrderRepository orderRepo;

        @Autowired
        private UserRepository userRepo;

        /*
         * =========================
         * PLACE ORDER (CHECKOUT)
         * =========================
         */

        @PostMapping("/place")
        @Transactional
        public ResponseEntity<?> placeOrder(Authentication auth) {

                String email = auth.getName();

                User user = userRepo
                                .findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                return ResponseEntity.ok(
                                new OrderDTO(orderService.placeOrder(user)));
        }

        /*
         * =========================
         * GET MY ORDERS
         * =========================
         */

        @GetMapping("/my")
        public List<OrderDTO> getMyOrders(Authentication auth) {

                String email = auth.getName();

                User user = userRepo
                                .findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                return orderRepo.findByUser(user).stream()
                                .map(OrderDTO::new)
                                .collect(Collectors.toList());
        }

        /*
         * =========================
         * CANCEL ORDER
         * =========================
         */

        @PutMapping("/cancel/{orderId}")
        @Transactional
        public ResponseEntity<?> cancelOrder(

                        @PathVariable Long orderId,
                        Authentication auth

        ) {

                if (auth == null) {
                        throw new RuntimeException("Unauthorized");
                }

                String email = auth.getName();

                User user = userRepo
                                .findByEmail(email)
                                .orElseThrow();

                return ResponseEntity.ok(
                                new OrderDTO(orderService.cancelOrder(orderId, user)));
        }

        /*
         * =========================
         * ADMIN - GET ALL ORDERS
         * =========================
         */

        @GetMapping("/all")
        @PreAuthorize("hasAuthority('ROLE_ADMIN')")
        public List<OrderDTO> getAllOrders() {

                return orderRepo.findAll().stream()
                                .map(OrderDTO::new)
                                .collect(Collectors.toList());

        }

        /*
         * =========================
         * BUY NOW
         * =========================
         */

        @PostMapping("/buy-now")
        @Transactional
        public OrderDTO buyNow(

                        @RequestParam Long productId,
                        @RequestParam int quantity,
                        Authentication auth

        ) {

                String email = auth.getName();

                User user = userRepo
                                .findByEmail(email)
                                .orElseThrow();

                return new OrderDTO(orderService.buyNow(

                                productId,
                                quantity,
                                user

                ));
        }

        /*
         * =========================
         * ADMIN - UPDATE STATUS
         * =========================
         */

        @PutMapping("/status/{id}")
        @PreAuthorize("hasAuthority('ROLE_ADMIN')")
        @Transactional
        public OrderDTO updateStatus(

                        @PathVariable Long id,
                        @RequestParam String status

        ) {

                Order order = orderRepo
                                .findById(id)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                order.setStatus(status);

                return new OrderDTO(orderRepo.save(order));
        }

        /*
         * =========================
         * TEST
         * =========================
         */

        @PutMapping("/test")
        public String testOrders() {

                return "Orders controller working";

        }

        @GetMapping("/ping")
        public String ping() {

                return "ORDERS CONTROLLER OK";

        }

        /*
         * =========================
         * ADMIN DASHBOARD SUMMARY
         * =========================
         */

        @GetMapping("/admin/summary")
        @PreAuthorize("hasAuthority('ROLE_ADMIN')")
        public Map<String, Object> adminSummary() {

                List<Order> orders = orderRepo.findAll();

                long placed = orders.stream()
                                .filter(o -> o.getStatus().equals("PLACED"))
                                .count();

                long shipped = orders.stream()
                                .filter(o -> o.getStatus().equals("SHIPPED"))
                                .count();

                long delivered = orders.stream()
                                .filter(o -> o.getStatus().equals("DELIVERED"))
                                .count();

                long cancelled = orders.stream()
                                .filter(o -> o.getStatus().equals("CANCELLED"))
                                .count();

                double revenue = orders.stream()
                                .filter(o -> o.getStatus().equals("DELIVERED"))
                                .mapToDouble(Order::getTotalAmount)
                                .sum();

                Map<String, Object> res = new HashMap<>();

                res.put("totalOrders", orders.size());
                res.put("placed", placed);
                res.put("shipped", shipped);
                res.put("delivered", delivered);
                res.put("cancelled", cancelled);
                res.put("revenue", revenue);

                return res;
        }

}