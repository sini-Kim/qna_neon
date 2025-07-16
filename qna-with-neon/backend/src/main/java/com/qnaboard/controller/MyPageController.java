package com.qnaboard.controller;

import com.qnaboard.service.MyPageService;
import com.qnaboard.service.MemberService;
import com.qnaboard.dto.QuestionDto;
import java.util.*;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.qnaboard.entity.Member;

@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
public class MyPageController {    
	@Autowired
	private final MyPageService myPageService;
	@Autowired
	private final MemberService memberService;
	
	// 닉네임 변경
	@PutMapping("/nickname")
	public ResponseEntity<?> updateNickname(
		@RequestBody Map<String, String> request,
		@AuthenticationPrincipal Member member) {
		System.out.println("PUT /api/members/me/nickname hit");
		System.out.println("member = " + member);
		
		try {
			String newNickname = request.get("nickname");
			memberService.updateNickname(member.getId(), newNickname);
			return ResponseEntity.ok(Map.of("message", "Nickname updated successfully"));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
		}
	}
	
	// 비밀번호 변경
	@PutMapping("/password")
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
	
	@GetMapping("/questions")
	public ResponseEntity<List<QuestionDto>> getMyQuestion(
		@AuthenticationPrincipal Member member
	){
		List<QuestionDto> questions = myPageService.getMyQuestions(member);
		return ResponseEntity.ok(questions);
	}

}