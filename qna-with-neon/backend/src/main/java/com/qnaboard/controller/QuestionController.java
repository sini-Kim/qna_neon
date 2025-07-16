package com.qnaboard.controller;

import com.qnaboard.dto.QuestionDto;
import com.qnaboard.entity.Member;
import com.qnaboard.entity.Question;
import com.qnaboard.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal; // 시큐리티 적용 시
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import java.util.*;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;
		
	// Create : 질문 게시글 작성
    @PostMapping
    public ResponseEntity<QuestionDto> createQuestion(
            @RequestBody QuestionDto questionDto,
            @AuthenticationPrincipal Member member 
    ) {
			Question savedQuestion = questionService.createQuestion(questionDto, member);
    		return ResponseEntity.ok(QuestionDto.fromEntity(savedQuestion));
	}
	
	@GetMapping
	public ResponseEntity<List<QuestionDto>> getQuestion(){
		List<QuestionDto> questions = questionService.getAllQuestions();
		return ResponseEntity.ok(questions);
	}

	// Read : 질문 게시글 상세 조회 
    @GetMapping("/{id}")
    public ResponseEntity<QuestionDto> getQuestion(
		@PathVariable Long id,
		@AuthenticationPrincipal Member member
	) {
        QuestionDto questionDto = questionService.getQuestionByIdAndIncrementView(id, member);
        return ResponseEntity.ok(questionDto);
    }

	// Update : 질문 게시글 수정
	@PutMapping("/{id}")
    public ResponseEntity<QuestionDto> updateQuestion(
            @PathVariable Long id,
            @RequestBody QuestionDto questionDto,
            @AuthenticationPrincipal Member member // 시큐리티 없으면 매개변수 제거 후 테스트용 멤버 하드코딩
    ) {
        Question updatedQuestion = questionService.updateQuestion(id, questionDto, member);
        return ResponseEntity.ok(QuestionDto.fromEntity(updatedQuestion));
    }

	// Delete : 질문 게시글 삭제 
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(
            @PathVariable Long id,
            @AuthenticationPrincipal Member member 
    ) {
        questionService.deleteQuestion(id, member);
        return ResponseEntity.noContent().build();
    }
	
	// Post : 질문 게시글 좋아요 
	@PostMapping("/{id}/like")
	public ResponseEntity<Map<String, Object>> toggleQuestionLike(
        @PathVariable Long id,
        @AuthenticationPrincipal Member member
	) 	{
		long likeCount = questionService.toggleQuestionLike(id, member);

		Map<String, Object> response = new HashMap<>();
		response.put("message", "Like status toggled successfully");
		response.put("likeCount", likeCount);

		return ResponseEntity.ok(response);
	}
	
	/*
    @GetMapping("/search")
    public ResponseEntity<Page<QuestionDto>> searchQuestions(
            @RequestParam String keyword,
            Pageable pageable
    ) {
        Page<QuestionDto> questions = questionService.searchQuestions(keyword, pageable);
        return ResponseEntity.ok(questions);
    }
    @GetMapping("/tag")
    public ResponseEntity<Page<QuestionDto>> getQuestionsByTag(
            @RequestParam String tagName,
            Pageable pageable
    ) {
        Page<QuestionDto> questions = questionService.getQuestionsByTag(tagName, pageable);
        return ResponseEntity.ok(questions);
    }
	*/

}

