package com.dynonuggets.refonteimplicaction.model;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import javax.persistence.*;
import java.time.Instant;
import java.util.List;

import static javax.persistence.FetchType.LAZY;
import static javax.persistence.GenerationType.IDENTITY;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Getter
@Setter
@Builder
public class Subreddit {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;
    @NotBlank(message = "Community name is required")
    private String name;
    @NotBlank(message = "Description is required")
    private String description;
    @OneToMany(mappedBy = "subreddit")
    private List<Post> posts;
    private Instant createdAt;
    @ManyToOne(fetch = LAZY)
    private User user;
}
