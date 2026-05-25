package com.example.demo.payment;

import com.example.demo.order.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
//@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    @Autowired
    private FakePaymentService paymentService;

    @Autowired
    private OrderService orderService;

    @PostMapping("/pay")
    public ResponseEntity<?> pay(
            @RequestParam Long orderId,
            @RequestParam double amount
    ) {
        String paymentId = paymentService.processPayment(amount);
        orderService.markOrderPaid(orderId, paymentId);

        return ResponseEntity.ok(
                Map.of(
                        "paymentId", paymentId,
                        "status", "PAID"
                )
        );
    }
}