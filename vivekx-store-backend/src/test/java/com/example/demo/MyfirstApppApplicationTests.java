package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.UserRepository;
import com.example.demo.User;
import com.example.demo.order.*;
import com.example.demo.dto.OrderDTO;
import com.example.demo.dto.ProductDTO;
import com.example.demo.Product;
import com.example.demo.ProductRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;

@SpringBootTest
class MyfirstApppApplicationTests {

	@Autowired
	private OrderController orderController;

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private ProductRepository productRepo;

	@Autowired
	private OrderRepository orderRepo;

	@Autowired
	private OrderItemRepository orderItemRepo;

	@Autowired
	private ObjectMapper objectMapper;

	@Test
	void contextLoads() {
	}

	@Test
	void testOrderSerializationFlow() throws Exception {
		// 1. Create and save a user
		User user = new User();
		user.setName("Test User");
		user.setEmail("test@example.com");
		user.setPassword("password");
		user.setRole("USER");
		user = userRepo.save(user);

		// 2. Create and save a product
		Product product = new Product();
		product.setName("Test Product");
		product.setPrice(100.0);
		product.setSlug("test-product");
		product.setStock(10);
		product.setProductCode("TEST-PROD-CODE");
		product = productRepo.save(product);

		// 3. Create and save an order
		Order order = new Order();
		order.setUser(user);
		order.setStatus("PLACED");
		order.setTotalAmount(100.0);
		order = orderRepo.save(order);

		// 4. Create and save an order item
		OrderItem item = new OrderItem();
		item.setOrder(order);
		item.setProduct(product);
		item.setQuantity(1);
		item.setPrice(100.0);
		orderItemRepo.save(item);

		// Set EAGER lists
		order.setItems(List.of(item));
		orderRepo.save(order);

		// 5. Setup mock authentication
		UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
			user.getEmail(),
			null,
			List.of(() -> "ROLE_USER")
		);
		SecurityContextHolder.getContext().setAuthentication(auth);

		try {
			// 6. Invoke getMyOrders controller method
			List<OrderDTO> orders = orderController.getMyOrders(auth);
			System.out.println("--- SUCESSFULLY FETCHED ORDERS, SIZE: " + orders.size());

			// 7. Test Jackson serialization to JSON
			String json = objectMapper.writeValueAsString(orders);
			System.out.println("--- SERIALIZED JSON: " + json);
		} catch (Exception e) {
			System.out.println("--- DETECTED SERIALIZATION EXCEPTION ---");
			e.printStackTrace();
			throw e;
		} finally {
			SecurityContextHolder.clearContext();
		}
	}
}
