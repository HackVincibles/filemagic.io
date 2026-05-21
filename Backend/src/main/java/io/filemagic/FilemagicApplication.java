/*
 * Purpose: Spring Boot entrypoint for the filemagic.io REST API.
 */
package io.filemagic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class FilemagicApplication {

    public static void main(String[] args) {
        SpringApplication.run(FilemagicApplication.class, args);
    }
}
