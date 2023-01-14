import {Component} from '@angular/core';


@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent {
  initEditor: any
  dataEditor: HTMLDataElement

  constructor() {
    this.initEditor = {
      plugins: 'lists link image table code help wordcount media save', media_live_embeds: true,
      language: "fr_FR"
    }
  }

  saveData() {

    console.log("test")
    console.log(this.dataEditor)
  }

}
