package com.qnaboard.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "answer_likes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"member_id", "answer_id"})
})
@Getter
@Setter
@NoArgsConstructor
public class AnswerLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(optional = false)
    @JoinColumn(name = "answer_id")
    private Answer answer;

    public AnswerLike(Member member, Answer answer) {
        this.member = member;
        this.answer = answer;
    }
}
