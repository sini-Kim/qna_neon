package com.qnaboard.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class MemberRegisterDto {
	@NotBlank(message = "Nickname is required")
    @Size(min = 2, max = 30, message = "Nickname must be between 2 and 30 characters")
    private String nickname;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    // Constructors
    public MemberRegisterDto() {}

    public MemberRegisterDto(String nickname, String email, String password) {
		this.nickname = nickname;
        this.email = email;
        this.password = password;
    }

	public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }



    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

