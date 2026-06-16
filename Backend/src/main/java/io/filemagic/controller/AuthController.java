/*
 * Purpose: Register / login JSON API.
 */
package io.filemagic.controller;

import io.filemagic.document.User;
import io.filemagic.service.AuthService;
import io.filemagic.service.AuthService.TokenPair;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterBody body) {
        TokenPair pair = authService.register(body.email(), body.password(), body.displayName());
        return ResponseEntity.ok(Map.of(
                "ok", true,
                "accessToken", pair.accessToken(),
                "tokenType", "Bearer"
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginBody body) {
        TokenPair pair = authService.login(body.email(), body.password());
        return ResponseEntity.ok(Map.of(
                "ok", true,
                "accessToken", pair.accessToken(),
                "tokenType", "Bearer"
        ));
    }

    @org.springframework.web.bind.annotation.GetMapping("/profile")
    public ResponseEntity<User> profile(@AuthenticationPrincipal String userId) {
        if (userId == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(authService.getProfile(userId));
    }

    public record RegisterBody(
            @NotBlank @Email String email,
            @NotBlank @Size(min = 8) String password,
            String displayName
    ) {
    }

    public record LoginBody(
            @NotBlank @Email String email,
            @NotBlank String password
    ) {
    }
}
