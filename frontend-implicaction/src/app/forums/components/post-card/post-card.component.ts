import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../model/post';
import { Univers } from '../../../shared/enums/univers';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
})
export class PostCardComponent implements OnInit {
  @Input() post: Post;
  readonly univers = Univers;
  ngOnInit(): void {}
}
