import {Component, OnInit} from '@angular/core';
import {ForumTableTypesEnum} from './enums/table-type-enum';
import {GroupService} from "./services/group.service";
import {PostService} from "./services/post.service";

@Component({
  selector: 'app-forums',
  templateUrl: './forums.component.html',
  styleUrls: ['./forums.component.scss'],
})
export class ForumsComponent implements OnInit {
  tableType = ForumTableTypesEnum;

  constructor(private groupService: GroupService, private postService: PostService) {
  }

  getForum(pageable) {
    return this.groupService
      .getAllGroups(pageable)
  }

  getLastPost(pageable) {
    return this.postService
      .getLatestPosts(10)
  }

  ngOnInit(): void {
    return;
  }
}
