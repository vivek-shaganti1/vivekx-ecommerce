package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/ownership")
//@CrossOrigin(origins = "http://localhost:5173")
public class OwnershipController {

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private OwnershipRepository ownershipRepo;

    @Autowired
    private XPService xpService;


    @GetMapping("/user/{userId}")
    public List<Ownership> getUserCollectibles(
            @PathVariable Long userId
    ) {

        return ownershipRepo.findByUserId(userId);

    }


    @PostMapping("/activate")
    public String activateProduct(

            @RequestParam String code,

            @RequestParam Long userId

    ){

        Product product =
                productRepo
                .findByProductCode(code)
                .orElseThrow(
                        () ->
                        new RuntimeException(
                                "Invalid code"
                        )
                );


        if(product.isActivated()){

            return "Already activated";

        }


        Ownership ownership =
                new Ownership();

        ownership.setUserId(userId);

        ownership.setProductId(
                product.getId()
        );

        ownership.setProductCode(code);

        ownership.setVerified(true);

        ownership.setActivationDate(
                LocalDateTime.now()
        );


        ownershipRepo.save(ownership);


        product.setActivated(true);

        productRepo.save(product);


        xpService.addXP(
                userId,
                100,
                "product activation"
        );


        return "Activated successfully";

    }

}