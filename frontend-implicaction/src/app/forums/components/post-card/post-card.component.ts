import {Component, Input, OnInit} from '@angular/core';
import {Post} from '../../model/post';
import {Univers} from '../../../shared/enums/univers';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
})
export class PostCardComponent implements OnInit {
  @Input() post: Post;
  readonly univers = Univers;
  userProfileUrl: string;
  redirectionPostUrl: string;
  groupId: string;

  constructor(private router: ActivatedRoute) {
    this.router.params.subscribe(params => {
      this.groupId = params.forumId
    })
  }

  ngOnInit(): void {
    this.userProfileUrl = `/${this.univers.USERS.url}/${this.post.userId}/profile`;
    this.redirectionPostUrl = `/${this.univers.FORUMS.url}/${this.groupId}/${this.post.id}`;
  }
}
