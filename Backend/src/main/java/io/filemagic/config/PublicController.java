// Purpose - Handle public API endpoints and access routes fr testing
package io.filemagic.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PublicController {

    @GetMapping("/")
    public String home() {
        return "Backend is running 🚀";
    }

    @GetMapping("/public/hello")
    public String hello() {
        return "Public API working ✅";
    }
}