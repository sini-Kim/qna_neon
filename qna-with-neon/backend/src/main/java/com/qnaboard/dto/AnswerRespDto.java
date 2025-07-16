package com.qnaboard.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import com.qnaboard.entity.Answer;

@Getter
@Setter
@NoArgsConstructor
public class AnswerRespDto {
    private Long id;
    private String content;
    private String writer;
    private LocalDateTime createdAt;
    private long likeCount;
    private boolean likedByUser;
	
	public AnswerRespDto(Long id, String content, String writer, LocalDateTime createdAt, boolean likedByUser, long likeCount) {
        this.id = id;
        this.content = content;
        this.writer = writer;
        this.createdAt = createdAt;
        this.likedByUser = likedByUser;
        this.likeCount = likeCount;
    }
	

    // Entity → DTO 변환 메서드, likedByUser 값을 함께 받음
    public static AnswerRespDto fromEntity(Answer answer, boolean likedByUser) {
        AnswerRespDto dto = new AnswerRespDto();
        dto.setId(answer.getId());
        dto.setContent(answer.getContent());
        dto.setWriter(answer.getWriter().getNickname());
        dto.setCreatedAt(answer.getCreatedAt());
        dto.setLikeCount(answer.getLikeCount());
        dto.setLikedByUser(likedByUser);
        return dto;
    }
}
