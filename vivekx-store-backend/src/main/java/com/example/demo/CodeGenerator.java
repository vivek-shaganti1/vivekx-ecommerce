package com.example.demo;

import java.util.UUID;

public class CodeGenerator {

    public static String generateProductCode(){

        return "VX-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0,8)
                        .toUpperCase();

    }

}