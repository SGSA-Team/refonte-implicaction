import {Component, Input} from '@angular/core';
import {Post} from '../../model/post';
import {Univers} from '../../../shared/enums/univers';
import {Constants} from '../../../config/constants';
import { Location } from '@angular/common';
import {ActivatedRoute} from "@angular/router";
import {ToasterService} from "../../../core/services/toaster.service";
import {PostService} from "../../services/post.service";
import {GroupService} from "../../services/group.service";
import {SidebarService} from "../../../shared/services/sidebar.service";

@Component({
  selector: 'app-post-tile',
  templateUrl: './post-tile.component.html',
  styleUrls: ['./post-tile.component.scss'],
})
export class PostTileComponent {
  @Input()
  post: Post = {};
  univers = Univers;
  constant = Constants;

  constructor(private location: Location) {
  }

  updateCommentCount(count: number): void {
    this.post.commentCount = count;
  }

  goBack() {
    this.location.back();
  }

}
