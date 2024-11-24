package com.spring.SpringRest.controller;

import org.springframework.web.bind.annotation.RestController;

import com.spring.SpringRest.payload.auth.UserLoginDTO;
import com.spring.SpringRest.model.Account;
import com.spring.SpringRest.payload.auth.AcccountDTO;
import com.spring.SpringRest.payload.auth.AccountViewDTO;
import com.spring.SpringRest.payload.auth.AuthoritiesDTO;
import com.spring.SpringRest.payload.auth.PasswordDTO;
import com.spring.SpringRest.payload.auth.ProfileDTO;
import com.spring.SpringRest.payload.auth.TokenDTO;
import com.spring.SpringRest.service.AccountService;
import com.spring.SpringRest.service.TokenService;
import com.spring.SpringRest.utils.constants.AccountError;
import com.spring.SpringRest.utils.constants.AccountSuccess;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Auth Controller", description = "Controller for Account management")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600, allowedHeaders = "*") 
@Slf4j
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private TokenService tokenService;

    @Autowired
    private AccountService accountService;
    
    @PostMapping(value = "/token")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<TokenDTO> token(@Valid @RequestBody UserLoginDTO userLogin) throws AuthenticationException{
        
        try{
            Authentication authentication = authenticationManager
                                        .authenticate(new UsernamePasswordAuthenticationToken(userLogin.getEmail(), userLogin.getPassword()));
        return ResponseEntity.ok(new TokenDTO(tokenService.generateToken(authentication)));
        }catch(Exception e){
            log.debug(AccountError.TOKEN_GENERATION_ERROR.toString() + ": " + e.getMessage());
            return new ResponseEntity<>(new TokenDTO(null), HttpStatus.BAD_REQUEST);
        }

    }
    
    @PostMapping(value = "/users/add", consumes = "application/json", produces = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Add a new User")
    @ApiResponse(responseCode = "400", description = "Please enter a valid email and password length between 6 to 20 characters.")
    @ApiResponse(responseCode = "200", description = "Account added")
    public ResponseEntity<String> addUser(@Valid @RequestBody AcccountDTO accountDTO) {
        try {
            Account account = new Account();
            account.setEmail(accountDTO.getEmail());
            account.setPassword(accountDTO.getPassword());
            accountService.save(account);
            return ResponseEntity.ok(AccountSuccess.ACCOUNT_ADDED.toString());
        } catch (Exception e) {
            log.debug(AccountError.ADD_ACCOUNT_ERROR.toString() + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
    
    @GetMapping(value = "/users", produces = "application/json")
    @Operation(summary = "List of users API")
    @ApiResponse(responseCode = "200", description = "List of users")
    @ApiResponse(responseCode = "401", description = "Token missing.")
    @ApiResponse(responseCode = "403", description = "Token error.")
    @SecurityRequirement(name = "album-api")
    public List<AccountViewDTO> users() {
        List<AccountViewDTO> accounts = new ArrayList<>();
        
        accountService.findAll()
        .stream()
        .map(account -> accounts.add(new AccountViewDTO(account.getId(), account.getEmail(), account.getAuthorities())))
        .collect(Collectors.toList());

        return accounts;
    }

    @PutMapping(value = "/users/{user_id}/update-authorities", produces = "application/json", consumes = "application/json")
    @Operation(summary = "Update Authorities")
    @ApiResponse(responseCode = "200", description = "Authorities Updated")
    @ApiResponse(responseCode = "400", description = "Invalid User ID")
    @ApiResponse(responseCode = "401", description = "Token missing.")
    @ApiResponse(responseCode = "403", description = "Token error.")
    @SecurityRequirement(name = "album-api")
    public ResponseEntity<AccountViewDTO> updateAuthorities(@Valid @RequestBody AuthoritiesDTO authoritiesDTO, @PathVariable long user_id) {
        Optional<Account> optionalAccount = accountService.findById(user_id);
        if(optionalAccount.isPresent()){
            Account account = optionalAccount.get();
            account.setAuthorities(authoritiesDTO.getAuthorities());
            accountService.save(account);

            return ResponseEntity.ok(new AccountViewDTO(account.getId(), account.getEmail(), account.getAuthorities()));
        }
        return new ResponseEntity<AccountViewDTO>(new AccountViewDTO(), HttpStatus.BAD_REQUEST);
    }

    @GetMapping(value = "/profile", produces = "application/json")
    @Operation(summary = "View Profile")
    @ApiResponse(responseCode = "200", description = "List of users")
    @ApiResponse(responseCode = "401", description = "Token missing.")
    @ApiResponse(responseCode = "403", description = "Token error.")
    @SecurityRequirement(name = "album-api")
    public ProfileDTO profile(Authentication authentication) {
        String email = authentication.getName();
        Optional<Account> optionalAccount = accountService.findByEmail(email);
        
        Account account = optionalAccount.get();
        ProfileDTO profileDTO = new ProfileDTO(account.getId() , account.getEmail(), account.getAuthorities());
        
        return profileDTO;
        
    }

    @PutMapping(value = "/profile/update-password", produces = "application/json", consumes = "application/json")
    @Operation(summary = "Update Password")
    @ApiResponse(responseCode = "200", description = "Password Updated")
    @ApiResponse(responseCode = "401", description = "Token missing.")
    @ApiResponse(responseCode = "403", description = "Token error.")
    @SecurityRequirement(name = "album-api")
    public AccountViewDTO updatePassword(@Valid @RequestBody PasswordDTO passwordDTO, Authentication authentication) {
        String email = authentication.getName();
        Optional<Account> optionalAccount = accountService.findByEmail(email);
        
        Account account = optionalAccount.get();
        account.setPassword(passwordDTO.getPassword());
        accountService.save(account);

        return new AccountViewDTO(account.getId(), account.getEmail(), account.getAuthorities());
    }

    @DeleteMapping(value = "/profile/delete")
    @Operation(summary = "Delete User")
    @ApiResponse(responseCode = "200", description = "Profile deleted")
    @ApiResponse(responseCode = "401", description = "Token missing.")
    @ApiResponse(responseCode = "403", description = "Token error.")
    @SecurityRequirement(name = "album-api")
    public ResponseEntity<String> deleteProfile(Authentication authentication) {
        String email = authentication.getName();
        Optional<Account> optionalAccount = accountService.findByEmail(email);
        if(optionalAccount.isPresent()){
            accountService.deleteById(optionalAccount.get().getId());
            return ResponseEntity.ok("User deleted.");
        }

        return new ResponseEntity<String>("Bad request", HttpStatus.BAD_REQUEST);
    }
    
}
