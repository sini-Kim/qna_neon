package com.qnaboard.service;

import com.qnaboard.dto.AnswerReqDto;
import com.qnaboard.dto.AnswerRespDto;
import com.qnaboard.entity.Answer;
import com.qnaboard.entity.AnswerLike;
import com.qnaboard.entity.Member;
import com.qnaboard.entity.Question;
import com.qnaboard.repository.AnswerRepository;
import com.qnaboard.repository.QuestionRepository;
import com.qnaboard.repository.AnswerLikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.stream.Collectors;

import java.util.*;

@Service
@Transactional
@RequiredArgsConstructor
public class AnswerService {

    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;
	private final AnswerLikeRepository answerLikeRepository;

	public AnswerRespDto createAnswer(AnswerReqDto dto, Long questionId, Member member) {
        Question question = questionRepository.findById(questionId)
            .orElseThrow(() -> new RuntimeException("Question not found"));

        Answer answer = new Answer();
        answer.setContent(dto.getContent());
        answer.setWriter(member);
        answer.setQuestion(question);

        Answer saved = answerRepository.save(answer);
		
		boolean likedByUser = false;

        // DTO 변환해서 반환
        return new AnswerRespDto(
            saved.getId(),
            saved.getContent(),
            saved.getWriter().getNickname(),  // 상황에 맞게 필드 변경
            saved.getCreatedAt(),
			likedByUser,
            saved.getLikeCount()
        );
    }

	@Transactional(readOnly = true)
	public List<AnswerRespDto> getAnswersByQuestion(Long questionId, Member member) {
		List<Answer> answers = answerRepository.findByQuestionId(questionId);
		
		return answers.stream()
			.map(answer -> {
				boolean likedByUser = answerLikeRepository.existsByMemberAndAnswer(member, answer);
				return AnswerRespDto.fromEntity(answer, likedByUser);
			})
			.collect(Collectors.toList());
	}

	@Transactional
    // 답변 수정
    public Answer updateAnswer(Long answerId, AnswerReqDto answerReqDto, Member member) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        // 본인 작성자만 수정 가능
        if (!answer.getWriter().getId().equals(member.getId())) {
            throw new RuntimeException("You can only edit your own answers");
        }

        answer.setContent(answerReqDto.getContent());

        return answer;
    }

    @Transactional
    public void deleteAnswer(Long answerId, Member member) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        if (!answer.getWriter().getId().equals(member.getId())) {
            throw new RuntimeException("You can only delete your own answers");
        }

        answerRepository.delete(answer);
    }
	
	
	@Transactional
	public long toggleAnswerLike(Long answerId, Member member) {
		Answer answer = answerRepository.findById(answerId)
			.orElseThrow( () -> new RuntimeException("Answer not found"));
		
		Optional<AnswerLike> existingLike = answerLikeRepository.findByMemberAndAnswer(member, answer);

		if (existingLike.isPresent()) {
        	answerLikeRepository.delete(existingLike.get()); // 좋아요 취소
			answer.setLikeCount(Math.max(answer.getLikeCount() - 1, 0));
    } 	else {
        	AnswerLike like = new AnswerLike(member, answer);
        	answerLikeRepository.save(like); // 좋아요 추가
			answer.setLikeCount(answer.getLikeCount() + 1);
    	}
		

    	return answer.getLikeCount();
		}

}

