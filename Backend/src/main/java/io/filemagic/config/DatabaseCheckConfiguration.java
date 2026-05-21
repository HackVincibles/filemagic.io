package io.filemagic.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.sql.Connection;

@Configuration
public class DatabaseCheckConfiguration {

    private static final Logger log = LoggerFactory.getLogger(DatabaseCheckConfiguration.class);

    @Bean
    public CommandLineRunner checkDatabaseConnection(DataSource dataSource) {
        return args -> {
            try (Connection connection = dataSource.getConnection()) {
                if (connection != null && !connection.isClosed()) {
                    log.info("====================================================");
                    log.info("DATABASE CONNECTED SUCCESSFULLY: " + connection.getMetaData().getURL());
                    log.info("====================================================");
                } else {
                    log.error("====================================================");
                    log.error("DATABASE CONNECTION FAILED (Connection is null or closed)");
                    log.error("====================================================");
                }
            } catch (Exception e) {
                log.error("====================================================");
                log.error("DATABASE CONNECTION ERROR: " + e.getMessage());
                log.error("====================================================");
            }
        };
    }
}
