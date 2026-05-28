package com.example.demo.dto;

import com.example.demo.order.Order;
import com.example.demo.order.OrderItem;
import com.example.demo.User;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class OrderDTO {
    private Long id;
    private UserDTO user;
    private String status;
    private String paymentId;
    private double totalAmount;
    private LocalDateTime createdAt;
    private List<OrderItemDTO> items;

    public static class UserDTO {
        private Long id;
        private String name;
        private String email;
        private String role;

        public UserDTO() {}
        public UserDTO(User u) {
            if (u != null) {
                this.id = u.getId();
                this.name = u.getName();
                this.email = u.getEmail();
                this.role = u.getRole();
            }
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    public static class OrderItemDTO {
        private Long id;
        private ProductDTO product;
        private int quantity;
        private double price;

        public OrderItemDTO() {}
        public OrderItemDTO(OrderItem item) {
            this.id = item.getId();
            if (item.getProduct() != null) {
                this.product = new ProductDTO(item.getProduct());
            }
            this.quantity = item.getQuantity();
            this.price = item.getPrice();
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public ProductDTO getProduct() { return product; }
        public void setProduct(ProductDTO product) { this.product = product; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
        public double getPrice() { return price; }
        public void setPrice(double price) { this.price = price; }
    }

    public OrderDTO() {}
    public OrderDTO(Order order) {
        this.id = order.getId();
        if (order.getUser() != null) {
            this.user = new UserDTO(order.getUser());
        }
        this.status = order.getStatus();
        this.paymentId = order.getPaymentId();
        this.totalAmount = order.getTotalAmount();
        this.createdAt = order.getCreatedAt();
        if (order.getItems() != null) {
            this.items = order.getItems().stream()
                .map(OrderItemDTO::new)
                .collect(Collectors.toList());
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public UserDTO getUser() { return user; }
    public void setUser(UserDTO user) { this.user = user; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }
    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public List<OrderItemDTO> getItems() { return items; }
    public void setItems(List<OrderItemDTO> items) { this.items = items; }
}
