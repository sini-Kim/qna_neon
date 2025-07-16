package com.qnaboard.service;

import com.qnaboard.dto.MemberRegisterDto;
import com.qnaboard.entity.Member;
import com.qnaboard.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 회원 가입
     */
    public Member registerMember(MemberRegisterDto registrationDto) {

        if (memberRepository.existsByEmail(registrationDto.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        if (memberRepository.existsByNickname(registrationDto.getNickname())) {
            throw new IllegalArgumentException("Nickname already exists");
        }

        Member member = new Member();
        member.setNickname(registrationDto.getNickname());
        member.setEmail(registrationDto.getEmail());
        member.setPassword(passwordEncoder.encode(registrationDto.getPassword()));

        return memberRepository.save(member);
    }

    public Optional<Member> findByEmail(String email) {
        return memberRepository.findByEmail(email);
    }
	
	// 닉네임 수정
	@Transactional
	public void updateNickname(Long memberId, String newNickname) {
		Member member = memberRepository.findById(memberId).orElseThrow(() -> new RuntimeException("Member not found"));
		member.setNickname(newNickname);
		memberRepository.save(member);
	}
	
	@Transactional
	public void updatePassword(Long memberId, String oldPassword, String newPassword) {
    Member member = memberRepository.findById(memberId).orElseThrow(() -> new RuntimeException("Member not found"));
    
    if (!passwordEncoder.matches(oldPassword, member.getPassword())) {
        throw new RuntimeException("Old password is incorrect");
    }
    
    member.setPassword(passwordEncoder.encode(newPassword));
    memberRepository.save(member);
}
	
	
	// Id로 회원 조회 
	@Transactional(readOnly = true)
    public Optional<Member> findById(Long id) {
        return memberRepository.findById(id);
    }
	
	public Optional<Member> findByNickname(String nickname) {
    	return memberRepository.findByNickname(nickname);
	}

    /**
     * 비밀번호 일치 여부 확인
     */
    public boolean validatePassword(Member member, String rawPassword) {
        return passwordEncoder.matches(rawPassword, member.getPassword());
    }
}


