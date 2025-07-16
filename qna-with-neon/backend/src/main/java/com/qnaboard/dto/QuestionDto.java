package com.qnaboard.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.qnaboard.entity.Question;

@Getter
@Setter
@NoArgsConstructor
public class QuestionDto {

    private Long id;
    private String title;
    private String content;
    private String writerNickname; 
	

    private int viewCount;
    private int likeCount;

    private LocalDateTime createdAt; // 생성일시 추가
	private boolean likedByUser;

    // Entity → DTO 변환 편의 메서드
    public static QuestionDto fromEntity(Question question) {
        QuestionDto dto = new QuestionDto();
        dto.setId(question.getId());
        dto.setTitle(question.getTitle());
        dto.setContent(question.getContent());
        dto.setWriterNickname(question.getWriter().getNickname());
        dto.setViewCount(question.getViewCount());
        dto.setLikeCount(question.getLikeCount());
        dto.setCreatedAt(question.getCreatedAt());

        return dto;
    }
}



