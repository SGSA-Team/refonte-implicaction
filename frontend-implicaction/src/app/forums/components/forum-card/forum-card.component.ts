import { Component, Input, OnInit } from '@angular/core';
import { Univers } from 'src/app/shared/enums/univers';
import { Group } from '../../model/group';

@Component({
  selector: 'app-forum-card',
  templateUrl: './forum-card.component.html',
  styleUrls: ['./forum-card.component.scss'],
})
export class ForumCardComponent implements OnInit {
  @Input() group: Group;
  redirectionUrl: string;

  constructor() {}
  ngOnInit(): void {
    this.redirectionUrl = `/${Univers.FORUMS.url}/${this.group.id}`;
    console.log(this.redirectionUrl);
  }
}
