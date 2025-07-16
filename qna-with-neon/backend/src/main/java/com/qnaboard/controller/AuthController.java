package com.qnaboard.controller;

import com.qnaboard.dto.MemberLoginDto;
import com.qnaboard.dto.MemberRegisterDto;
import com.qnaboard.entity.Member;
import com.qnaboard.service.MemberService;
import com.qnaboard.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;


import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final MemberService memberService;
    private final JwtUtil jwtUtil;

    public AuthController(MemberService memberService, JwtUtil jwtUtil) {
        this.memberService = memberService;
        this.jwtUtil = jwtUtil;
    }

    // 회원가입
    @PostMapping("/register")
    public ResponseEntity<?> registerMember(@Valid @RequestBody MemberRegisterDto registerDto) {
        try {
            Member member = memberService.registerMember(registerDto);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("userId", member.getId());
            response.put("username", member.getNickname());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

	// 로그인
	@PostMapping("/login")
	public ResponseEntity<?> loginMember(@Valid @RequestBody MemberLoginDto loginDto) {
		try {
			// 이메일로 회원 조회
			Optional<Member> memberOptional = memberService.findByEmail(loginDto.getEmail());

			if (memberOptional.isEmpty()) {
				Map<String, String> error = new HashMap<>();
				error.put("error", "Invalid email or password");
				return ResponseEntity.badRequest().body(error);
			}

			Member member = memberOptional.get();

			// 비밀번호 검증
			if (!memberService.validatePassword(member, loginDto.getPassword())) {
				Map<String, String> error = new HashMap<>();
				error.put("error", "Invalid email or password");
				return ResponseEntity.badRequest().body(error);
			}

			// JWT 발급 : 로그인 시 이메일로
			String token = jwtUtil.generateToken(member.getEmail());

			Map<String, Object> response = new HashMap<>();
			response.put("token", token);
			response.put("userId", member.getId());
			response.put("nickname", member.getNickname());
			response.put("email", member.getEmail());

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			Map<String, String> error = new HashMap<>();
			error.put("error", "Login failed");
			return ResponseEntity.badRequest().body(error);
		}
	}
	




	
}

