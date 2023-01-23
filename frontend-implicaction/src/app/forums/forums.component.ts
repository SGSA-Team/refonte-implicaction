import {Component, OnInit} from '@angular/core';
import {ForumTableTypesEnum} from './enums/table-type-enum';

@Component({
  selector: 'app-forums',
  templateUrl: './forums.component.html',
  styleUrls: ['./forums.component.scss'],
})
export class ForumsComponent implements OnInit {
  tableType = ForumTableTypesEnum;

  constructor() {
  }

  ngOnInit(): void {
    return;
  }
}
