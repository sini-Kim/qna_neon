package com.qnaboard.repository;

import com.qnaboard.entity.QuestionLike;
import com.qnaboard.entity.Member;
import com.qnaboard.entity.Question;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionLikeRepository extends JpaRepository<QuestionLike, Long> {
    Optional<QuestionLike> findByMemberAndQuestion(Member member, Question question);
    int countByQuestion(Question question);
	
}