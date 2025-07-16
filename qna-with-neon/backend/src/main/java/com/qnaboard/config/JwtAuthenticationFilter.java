package com.qnaboard.config;

import com.qnaboard.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.qnaboard.repository.MemberRepository;
import com.qnaboard.entity.Member;

import java.io.IOException;
import java.util.*;
import org.springframework.security.core.GrantedAuthority;


@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private MemberRepository memberRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String token = jwtUtil.resolveToken(request);

        if (token != null && jwtUtil.validateToken(token)) {
            String email = jwtUtil.extractUsername(token);
			
			Optional<Member> optionalMember = memberRepository.findByEmail(email);
			
			if (optionalMember.isPresent()) {
            	Member member = optionalMember.get();

            	UsernamePasswordAuthenticationToken authentication =
                    	new UsernamePasswordAuthenticationToken(member, null, new ArrayList<>());
            	// 권한이 없으면 빈 리스트로 넣어도 됨

            	authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            	SecurityContextHolder.getContext().setAuthentication(authentication);
        	}
        }

        filterChain.doFilter(request, response);
    }
}
