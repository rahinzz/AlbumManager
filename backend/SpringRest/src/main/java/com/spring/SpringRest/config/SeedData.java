package com.spring.SpringRest.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.spring.SpringRest.model.Account;
import com.spring.SpringRest.service.AccountService;
import com.spring.SpringRest.utils.constants.Authority;

@Component
public class SeedData implements CommandLineRunner {

    @Autowired
    private AccountService accountService;

    @Override
    public void run(String... args) throws Exception {
        Account account01 = new Account();
        Account account02 = new Account();

        account01.setEmail("user@gmail.com");
        account01.setPassword("password1");
        account01.setAuthorities(Authority.USER.toString());
        accountService.save(account01);

        account02.setEmail("admin@gmail.com");
        account02.setPassword("password2");
        account02.setAuthorities(Authority.ADMIN.toString() + " " + Authority.USER.toString());
        accountService.save(account02);
    }
    
}
