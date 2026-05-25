package com.example.demo.payment;

import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class FakePaymentService {

    public String processPayment(double amount) {
        try {
            Thread.sleep(1500); // simulate payment delay
        } catch (InterruptedException ignored) {}

        return "PAY_" + UUID.randomUUID();
    }
}