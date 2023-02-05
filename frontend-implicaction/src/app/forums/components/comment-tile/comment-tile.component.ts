import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Comment} from '../../model/comment';
import {Constants} from '../../../config/constants';
import {Univers} from '../../../shared/enums/univers';
import {ViewportScroller} from "@angular/common";

@Component({
  selector: ' app-comment-tile',
  templateUrl: './comment-tile.component.html',
  styleUrls: ['./comment-tile.component.scss']
})
export class CommentTileComponent {

  @Input()
  comment: Comment = {};
  constants = Constants;
  univers = Univers;
  @Output() responseTo = new EventEmitter<Comment>();
  
  constructor(private scroller: ViewportScroller,
  ) {
  }

  emitAnswerToComment() {
    this.scroller.scrollToAnchor("editor")
    this.responseTo.emit(this.comment)
  }

}
