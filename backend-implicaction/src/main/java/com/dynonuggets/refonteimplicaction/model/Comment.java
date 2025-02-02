package com.dynonuggets.refonteimplicaction.model;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import javax.persistence.*;
import java.time.Instant;

import static javax.persistence.FetchType.LAZY;
import static javax.persistence.GenerationType.IDENTITY;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "comment")
public class Comment {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @NotEmpty
    @Column(columnDefinition = "TEXT")
    private String text;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "post_id", referencedColumnName = "id")
    private Post post;

    private Instant createdAt;

    @Column(name = "is_response")
    private boolean isResponse;
    @Column(name = "response_id")
    private Long responseId;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "group_id", referencedColumnName = "id")
    private Group group;
}
