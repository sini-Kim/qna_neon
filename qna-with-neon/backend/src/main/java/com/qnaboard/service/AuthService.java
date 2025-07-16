package com.qnaboard.service;

import com.qnaboard.entity.Member;
import com.qnaboard.repository.MemberRepository;
import com.qnaboard.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtTokenProvider jwtTokenProvider;
    private final MemberRepository memberRepository;

    public Member getUserFromToken(String token) {
        // 1) 토큰 앞의 "Bearer " 제거
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        // 2) JWT에서 이메일 추출
        String email = jwtTokenProvider.getEmailFromToken(token);

        // 3) 이메일로 Member 조회
        return memberRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("해당 사용자를 찾을 수 없습니다."));
    }
}
