package com.spring.SpringRest.payload.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AccountViewDTO {
    private long id;

    private String email;

    private String authorities;
}
