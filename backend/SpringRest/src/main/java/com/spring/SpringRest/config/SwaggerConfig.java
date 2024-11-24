package com.spring.SpringRest.config;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.*;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "User API",
        version = "version 1.0",
        contact = @Contact(
            name = "Album API", email = "rahinawadiya1405@gmail.com", url = "#"
        ),
        license = @License(
            name = "Apache 2.0", url = "https://www.apache.org/licenses/LICENSE-2.0"
        ),
        termsOfService = "#",
        description = "Spring Boot RestFul API Demo by Rahin"
    )
)
public class SwaggerConfig {
    
}
