package com.qnaboard.controller;

import com.qnaboard.dto.AnswerReqDto;
import com.qnaboard.dto.AnswerRespDto;
import lombok.RequiredArgsConstructor;
import com.qnaboard.entity.Answer;
import com.qnaboard.entity.Member;
import com.qnaboard.service.AnswerService;
import com.qnaboard.service.AuthService;
import com.qnaboard.repository.AnswerLikeRepository;
import com.qnaboard.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal; 
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/questions/")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AnswerController {

    private final AnswerService answerService;
    private final AuthService authService;
    private final JwtUtil jwtUtil;
	private final AnswerLikeRepository answerLikeRepository;

	// 글에 해당하는 답글 생성
	@PostMapping("/{questionId}/answers")
	public ResponseEntity<?> createAnswer(@PathVariable Long questionId,
										  @Valid @RequestBody AnswerReqDto answerReqDto,
										  @AuthenticationPrincipal Member member) {
		try {
			AnswerRespDto respDto = answerService.createAnswer(answerReqDto, questionId, member);
			return ResponseEntity.ok(respDto);
		} catch (RuntimeException e) {
			Map<String, String> error = new HashMap<>();
			error.put("error", e.getMessage());
			return ResponseEntity.badRequest().body(error);
		}
	}

	// 글에 해당하는 답글 조회 
    @GetMapping("/{questionId}/answers")
    public ResponseEntity<?> getAnswersByQuestion(
		@PathVariable Long questionId,
		@AuthenticationPrincipal Member member) {
		
        try {
            List<AnswerRespDto> answers = answerService.getAnswersByQuestion(questionId, member);
            return ResponseEntity.ok(answers);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch answers");
            return ResponseEntity.badRequest().body(error);
        }
    }

	// 답글 수정
    @PutMapping("/{questionId}/answers/{answerId}")
    public ResponseEntity<AnswerRespDto> updateAnswer(@PathVariable Long questionId,
										  @PathVariable Long answerId,
                                          @Valid @RequestBody AnswerReqDto answerReqDto,
                                          @AuthenticationPrincipal Member member) {
		
		    Answer updatedAnswer = answerService.updateAnswer(answerId, answerReqDto, member);
		
			boolean likedByUser = answerLikeRepository.existsByMemberAndAnswer(member, updatedAnswer);
    		return ResponseEntity.ok(AnswerRespDto.fromEntity(updatedAnswer, likedByUser));
    }
	
	// 답글 삭제
    @DeleteMapping("/{questionId}/answers/{answerId}")
    public ResponseEntity<Void> deleteAnswer(@PathVariable Long questionId,
										  @PathVariable Long answerId,
										  @AuthenticationPrincipal Member member) {
		    answerService.deleteAnswer(answerId, member);
        	return ResponseEntity.noContent().build();
    }

    private Member getMemberFromToken(String token) {
        String jwt = token.replace("Bearer ", "");
		
        if (jwtUtil.isTokenExpired(jwt)) {
            throw new RuntimeException("Token expired");
        }
        return authService.getUserFromToken(jwt);
    }
	
	// Post : 답변 좋아요 토글
	@PostMapping("/{questionId}/answers/{answerId}/like")
	public ResponseEntity<Map<String, Object>> toggleAnswerLike(
        @PathVariable Long questionId,
		@PathVariable Long answerId,
        @AuthenticationPrincipal Member member
	) 	{
		long likeCount = answerService.toggleAnswerLike(answerId, member);

		Map<String, Object> response = new HashMap<>();
		response.put("message", "Like status toggled successfully");
		response.put("likeCount", likeCount);

		return ResponseEntity.ok(response);
	}
}

