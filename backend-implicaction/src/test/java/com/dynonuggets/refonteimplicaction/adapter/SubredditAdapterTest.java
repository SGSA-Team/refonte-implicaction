package com.dynonuggets.refonteimplicaction.adapter;

import com.dynonuggets.refonteimplicaction.dto.SubredditDto;
import com.dynonuggets.refonteimplicaction.model.FileModel;
import com.dynonuggets.refonteimplicaction.model.Post;
import com.dynonuggets.refonteimplicaction.model.Subreddit;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.Arrays;

import static org.assertj.core.api.Assertions.assertThat;

class SubredditAdapterTest {

    SubredditAdapter subredditAdapter = new SubredditAdapter();

    @Test
    void should_map_to_model() {
        // given
        SubredditDto expected = SubredditDto.builder()
                .id(123L)
                .description("blablabla")
                .name("blabla")
                .build();

        // when
        final Subreddit actual = subredditAdapter.toModel(expected);

        // then
        assertThat(actual).usingRecursiveComparison()
                .ignoringFields("user", "posts", "numberOfPosts", "createdAt", "image")
                .isEqualTo(expected);
    }

    @Test
    void should_map_to_dto_with_count_when_model_has_posts() {
        // given
        Subreddit expectedModel = Subreddit.builder()
                .id(123L)
                .description("blablabla")
                .name("blabla")
                .posts(Arrays.asList(new Post(), new Post(), new Post(), new Post()))
                .createdAt(Instant.now())
                .build();

        // when
        final SubredditDto actualDto = subredditAdapter.toDto(expectedModel);

        // then
        assertThat(actualDto).usingRecursiveComparison()
                .ignoringFields("user", "posts", "numberOfPosts", "imageUrl")
                .isEqualTo(expectedModel);

        assertThat(actualDto.getNumberOfPosts()).isEqualTo(expectedModel.getPosts().size());
        assertThat(actualDto.getImageUrl()).isNull();
    }

    @Test
    void should_map_to_dto_with_image_url_when_model_has_image() {
        // given
        Subreddit expectedModel = Subreddit.builder()
                .id(123L)
                .description("blablabla")
                .name("blabla")
                .image(FileModel.builder().url("http://url.com").build())
                .createdAt(Instant.now())
                .build();

        // when
        final SubredditDto actualDto = subredditAdapter.toDto(expectedModel);

        // then
        assertThat(actualDto).usingRecursiveComparison()
                .ignoringFields("user", "posts", "numberOfPosts", "imageUrl")
                .isEqualTo(expectedModel);

        assertThat(actualDto.getNumberOfPosts()).isZero();
        assertThat(actualDto.getImageUrl()).isEqualTo(expectedModel.getImage().getUrl());
    }
}
