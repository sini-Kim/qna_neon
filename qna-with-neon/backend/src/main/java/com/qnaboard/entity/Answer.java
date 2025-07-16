package com.qnaboard.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.*;
import com.qnaboard.entity.AnswerLike;

@Entity
@Table(name = "answer")
@Getter
@Setter
@NoArgsConstructor
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Lob
    @Column(nullable = false)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member writer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;
	
	@Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
	
	@Column(columnDefinition = "INT DEFAULT 0", nullable = false)
    private int likeCount = 0;
	
	@OneToMany(mappedBy = "answer", cascade = CascadeType.REMOVE, orphanRemoval = true)
	private List<AnswerLike> answerLikes = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public void incrementLikeCount() {
        this.likeCount++;
    }
}

