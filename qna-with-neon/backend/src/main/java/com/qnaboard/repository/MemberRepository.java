package com.qnaboard.repository;

import com.qnaboard.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
	boolean existsByEmail(String email);
	boolean existsByNickname(String nickname);
	Optional<Member> findByEmail(String email);
	Optional<Member> findByNickname(String nickname);
}

