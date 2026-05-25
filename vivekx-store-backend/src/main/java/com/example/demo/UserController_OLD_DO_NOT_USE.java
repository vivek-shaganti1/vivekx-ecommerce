//package com.example.demo;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//
//@Controller
//public class UserController {
//
//    @Autowired
//    private UserService service;
//
//    // Show registration page (Browser)
//    @GetMapping("/register")
//    public String showRegisterPage() {
//        return "register";
//    }
//
//    // Handle form submit (Browser ONLY)
//    @PostMapping("/success")
//    public String registerUser(
//            @RequestParam("UName") String UName,
//            @RequestParam("email") String email,
//            @RequestParam("pass") String pass) {
//
//        User user = new User();
//        user.setName(UName);
//        user.setEmail(email);
//        user.setPassword(pass);
//
//        service.saveNewUser(user);
//
//        return "success"; // success.html
//    }
////}