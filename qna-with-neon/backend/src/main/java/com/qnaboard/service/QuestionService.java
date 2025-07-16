package com.qnaboard.service;

import com.qnaboard.dto.QuestionDto;
import com.qnaboard.entity.Member;
import com.qnaboard.entity.QuestionLike;
import com.qnaboard.entity.Question;
import com.qnaboard.repository.QuestionRepository;
import com.qnaboard.repository.QuestionLikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import org.springframework.data.domain.Sort;
import java.util.stream.Collectors;
import java.util.*;

@Service
@Transactional
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
	private final QuestionLikeRepository questionLikeRepository;

	@Transactional
    public Question createQuestion(QuestionDto questionDto, Member member) {
        if (member == null) {
            throw new RuntimeException("로그인한 사용자만 질문을 작성할 수 있습니다.");
        }

        Question question = new Question();
        question.setTitle(questionDto.getTitle());
        question.setContent(questionDto.getContent());
        question.setWriter(member);
        question.setViewCount(0);
        question.setLikeCount(0);
        question.setCreatedAt(LocalDateTime.now());


        return questionRepository.save(question);
    }
	
	@Transactional
	public List<QuestionDto> getAllQuestions(){
		List<Question> questionList = questionRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
		return questionList.stream()
			   .map(QuestionDto::fromEntity)
			   .collect(Collectors.toList());
	}

	@Transactional
    public QuestionDto getQuestionByIdAndIncrementView(Long id, Member member) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 질문을 찾을 수 없습니다."));

        question.incrementViewCount();
		
		int likeCount = questionLikeRepository.countByQuestion(question);
		
		boolean likedByUser = false;
		if(member != null) {
			likedByUser = questionLikeRepository.findByMemberAndQuestion(member, question).isPresent();
		}
		
		QuestionDto dto = QuestionDto.fromEntity(question);
		dto.setLikedByUser(likedByUser);
		dto.setLikeCount(likeCount);
		return dto;
    }

    public Page<QuestionDto> searchQuestions(String keyword, Pageable pageable) {
        Page<Question> questionPage =
                questionRepository.findByTitleContainingOrContentContaining(keyword, pageable);
        return questionPage.map(QuestionDto::fromEntity);
    }


	@Transactional
	public Question updateQuestion(Long questionId, QuestionDto questionDto, Member member) {
		Question question = questionRepository.findById(questionId)
			.orElseThrow(() -> new RuntimeException("해당 질문을 찾을 수 없습니다."));

		if (!question.getWriter().getId().equals(member.getId())) {
			throw new RuntimeException("본인이 작성한 질문만 삭제할 수 있습니다.");
		}

		question.setTitle(questionDto.getTitle());
		question.setContent(questionDto.getContent());
		// TODO: Tag 수정 처리

		return questionRepository.save(question);
	}

	@Transactional
	public void deleteQuestion(Long questionId, Member member) {
		Question question = questionRepository.findById(questionId)
			.orElseThrow(() -> new RuntimeException("해당 질문을 찾을 수 없습니다."));

		if (!question.getWriter().getId().equals(member.getId())) {
			throw new RuntimeException("본인이 작성한 질문만 삭제할 수 있습니다.");
		}

		questionRepository.delete(question);
	}
	
	@Transactional
	public long toggleQuestionLike(Long questionId, Member member) {
		Question question = questionRepository.findById(questionId)
			.orElseThrow( () -> new RuntimeException("Question not found"));
		
		Optional<QuestionLike> existingLike = questionLikeRepository.findByMemberAndQuestion(member, question);

		if (existingLike.isPresent()) {
        	questionLikeRepository.delete(existingLike.get()); // 좋아요 취소
    } 	else {
        	QuestionLike like = new QuestionLike(member, question);
        	questionLikeRepository.save(like); // 좋아요 추가
    }

    	return questionLikeRepository.countByQuestion(question);
		}

}

