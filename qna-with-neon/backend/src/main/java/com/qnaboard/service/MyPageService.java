package com.qnaboard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.qnaboard.repository.QuestionRepository;
import com.qnaboard.repository.MemberRepository;
import com.qnaboard.dto.QuestionDto;
import com.qnaboard.entity.Member;
import com.qnaboard.entity.Question;


import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MyPageService {
	private final QuestionRepository questionRepository;
    private final MemberRepository memberRepository;
	
	public List<QuestionDto> getMyQuestions(Member member) {
		List<Question> questions = questionRepository.findByWriter(member);
		return questions.stream()
				.map(QuestionDto::fromEntity)
				.toList();
		
	}
	
}