package com.qnaboard.repository;

import com.qnaboard.entity.Question;
import com.qnaboard.entity.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    // 질문 목록을 생성일 내림차순으로 페이지네이션 조회
    Page<Question> findAllByOrderByCreatedAtDesc(Pageable pageable);

    // 제목이나 내용에 키워드가 포함된 질문을 검색
    @Query("SELECT q FROM Question q WHERE q.title LIKE %:keyword% OR q.content LIKE %:keyword% ORDER BY q.createdAt DESC")
    Page<Question> findByTitleContainingOrContentContaining(@Param("keyword") String keyword, Pageable pageable);


    // 조회수 상위 10개 질문 조회
    List<Question> findTop10ByOrderByViewCountDesc();
	
	List<Question> findByWriter(Member writer);


    @Query("SELECT q FROM Question q LEFT JOIN q.answers a GROUP BY q.id ORDER BY COUNT(a) DESC")
    Page<Question> findAllOrderByAnswerCount(Pageable pageable);
	
	

	
	
}

