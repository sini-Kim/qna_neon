package com.qnaboard.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;


@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 200)
    @Column(nullable = false)
    private String title;

    @NotBlank
    @Lob
    @Column(nullable = false)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member writer;

    @Column(columnDefinition = "INT DEFAULT 0", nullable = false)
    private int viewCount = 0;

    @Column(columnDefinition = "INT DEFAULT 0", nullable = false)
    private int likeCount = 0;
	
	@Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
	
	// Answer 연관관계 추가
	@OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Answer> answers = new ArrayList<>();
	
	@OneToMany(mappedBy = "question", cascade = CascadeType.REMOVE, orphanRemoval = true)
	private List<QuestionLike> questionLikes;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public void incrementViewCount() {
        this.viewCount++;
    }

    public void incrementLikeCount() {
        this.likeCount++;
    }
	
}

