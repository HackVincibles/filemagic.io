/*
 * Purpose: Multipart processing endpoint (guest + optional JWT).
 */
package io.filemagic.controller;

import io.filemagic.model.SubscriptionPlan;
import io.filemagic.security.GuestIdentityService;
import io.filemagic.service.FileProcessingService;
import io.filemagic.service.FileProcessingService.ProcessedFile;
import io.filemagic.service.PlanResolutionService;
import io.filemagic.service.UsageLimitService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileProcessingService fileProcessingService;
    private final PlanResolutionService planResolutionService;
    private final UsageLimitService usageLimitService;
    private final GuestIdentityService guestIdentityService;

    public FileController(
            FileProcessingService fileProcessingService,
            PlanResolutionService planResolutionService,
            UsageLimitService usageLimitService,
            GuestIdentityService guestIdentityService
    ) {
        this.fileProcessingService = fileProcessingService;
        this.planResolutionService = planResolutionService;
        this.usageLimitService = usageLimitService;
        this.guestIdentityService = guestIdentityService;
    }

    @PostMapping(value = "/process", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Resource> process(
            @RequestParam("file") MultipartFile file,
            @RequestParam("operation") String operation,
            @RequestParam(value = "conversionMode", required = false) String conversionMode,
            @RequestParam(value = "compressionAlgorithm", required = false) String compressionAlgorithm,
            Authentication authentication,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        String guestFp = guestIdentityService.ensureGuestCookie(request, response);
        SubscriptionPlan plan = planResolutionService.resolve(authentication);
        String subjectKey = planResolutionService.subjectKey(authentication, guestFp);

        usageLimitService.assertUnderLimit(plan, subjectKey);
        
        Long userId = (authentication != null && authentication.getPrincipal() instanceof io.filemagic.security.JwtAuthenticationFilter.AuthenticatedUser au) 
            ? au.id() 
            : null;

        ProcessedFile processed = fileProcessingService.process(
                file, plan, operation, conversionMode, compressionAlgorithm, userId
        );
        usageLimitService.recordSuccessfulOperation(subjectKey);

        ByteArrayResource resource = new ByteArrayResource(processed.bytes());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + processed.downloadName() + "\"")
                .contentType(MediaType.parseMediaType(processed.contentType()))
                .contentLength(processed.bytes().length)
                .body(resource);
    }
}
