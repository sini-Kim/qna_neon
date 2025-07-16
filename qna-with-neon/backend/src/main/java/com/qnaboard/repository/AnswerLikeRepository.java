package com.qnaboard.repository;

import com.qnaboard.entity.AnswerLike;
import com.qnaboard.entity.Member;
import com.qnaboard.entity.Answer;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnswerLikeRepository extends JpaRepository<AnswerLike, Long> {
    Optional<AnswerLike> findByMemberAndAnswer(Member member, Answer answer);
    int countByAnswer(Answer answer);
	boolean existsByMemberAndAnswer(Member member, Answer answer);

	
}