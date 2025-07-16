package com.qnaboard.repository;

import com.qnaboard.entity.Answer;
import com.qnaboard.entity.Question;
import com.qnaboard.dto.AnswerRespDto;
import com.qnaboard.entity.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
	List<Answer> findByQuestionId(Long questionId);
}

