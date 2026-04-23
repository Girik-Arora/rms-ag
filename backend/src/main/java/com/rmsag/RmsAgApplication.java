package com.rmsag;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class RmsAgApplication {
    public static void main(String[] args) {
        SpringApplication.run(RmsAgApplication.class, args);
    }
}
