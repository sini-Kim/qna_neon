package com.qnaboard.controller;

import com.qnaboard.entity.Member;
import com.qnaboard.entity.Question;
import com.qnaboard.service.MemberService;
import com.qnaboard.service.QuestionService;
import com.qnaboard.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.HttpStatus;


import java.util.HashMap;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "*")
public class MemberController {
    @Autowired
    private MemberService memberService;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private JwtUtil jwtUtil;

	// 회원 정보 조회 
    @GetMapping("/{id}")
    public ResponseEntity<?> getMemberById(@PathVariable Long id) {
        try {
            Optional<Member> memberOptional = memberService.findById(id);
            if (memberOptional.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Member not found");
                return ResponseEntity.badRequest().body(error);
            }

            Member member = memberOptional.get();
            Map<String, Object> response = new HashMap<>();
            response.put("memberId", member.getId());
            response.put("nickname", member.getNickname());
            response.put("createdAt", member.getCreatedAt());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch member");
            return ResponseEntity.badRequest().body(error);
        }
    }
	
	@GetMapping("/me")
	public ResponseEntity<?> getMyInfo(@AuthenticationPrincipal Member member) {
		if (member == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
								 .body(Map.of("error", "Unauthorized"));
		}

		Map<String, Object> response = new HashMap<>();
		response.put("memberId", member.getId());
		response.put("nickname", member.getNickname());
		response.put("createdAt", member.getCreatedAt());

		return ResponseEntity.ok(response);
	}
	
	// 닉네임 변경
	@PutMapping("/me/nickname")
	public ResponseEntity<?> updateNickname(
		@RequestBody Map<String, String> request,
		@AuthenticationPrincipal Member member) {
		try {
			String newNickname = request.get("nickname");
			memberService.updateNickname(member.getId(), newNickname);
			return ResponseEntity.ok(Map.of("message", "Nickname updated successfully"));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
		}
	}
	
	// 비밀번호 변경
	@PutMapping("/me/password")
	public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> request, @AuthenticationPrincipal Member member) {
		try {
			String oldPassword = request.get("oldPassword");
			String newPassword = request.get("newPassword");
			memberService.updatePassword(member.getId(), oldPassword, newPassword);
			return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
		}
	}

    private Member getMemberFromToken(String token) {
        String jwt = token.replace("Bearer ", "");
        String email = jwtUtil.extractUsername(jwt);

        if (jwtUtil.isTokenExpired(jwt)) {
            throw new RuntimeException("Token expired");
        }

        Optional<Member> memberOptional = memberService.findByEmail(email);
        if (memberOptional.isEmpty()) {
            throw new RuntimeException("Member not found");
        }

        return memberOptional.get();
    }
}
