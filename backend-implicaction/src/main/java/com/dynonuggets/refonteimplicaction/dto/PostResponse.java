package com.dynonuggets.refonteimplicaction.dto;

import lombok.*;

@Data
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostResponse {
    private Long id;
    private String name;
    private String url;
    private String description;
    private String username;
    private Long userId;
    private String userImageUrl;
    private Long groupId;

    private String groupName;
    private Integer voteCount;

    private Integer views;
    private Integer commentCount;
    private String duration;
    private boolean upVote;
    private boolean downVote;
    private String subredditImageUrl;
}
