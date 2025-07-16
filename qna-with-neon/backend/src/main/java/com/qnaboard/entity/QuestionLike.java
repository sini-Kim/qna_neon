package com.qnaboard.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "question_likes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"member_id", "question_id"})
})
@Getter
@Setter
@NoArgsConstructor
public class QuestionLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(optional = false)
    @JoinColumn(name = "question_id")
    private Question question;

    public QuestionLike(Member member, Question question) {
        this.member = member;
        this.question = question;
    }
}

