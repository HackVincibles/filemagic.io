/*
 * Purpose: Public plan listing.
 */
package io.filemagic.controller;

import io.filemagic.document.SubscriptionPlan;
import io.filemagic.repository.SubscriptionPlanRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
public class PlanController {

    private final SubscriptionPlanRepository planRepository;

    public PlanController(SubscriptionPlanRepository planRepository) {
        this.planRepository = planRepository;
    }

    @GetMapping
    public ResponseEntity<List<SubscriptionPlan>> list() {
        return ResponseEntity.ok(planRepository.findAll());
    }
}
