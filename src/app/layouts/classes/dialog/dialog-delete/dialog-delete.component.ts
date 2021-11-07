import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog'

@Component({
  selector: 'app-dialog-delete',
  templateUrl: './dialog-delete.component.html',
  styleUrls: ['./dialog-delete.component.css']
})
export class DialogDeleteComponent  {

  constructor(public dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(DialogElementsExampleDialog);
  }
}
@Component({
  selector: 'dialog-elements-example-dialog',
  template: `<h1 mat-dialog-title>Dialog with elements</h1>
  <div mat-dialog-content>This dialog showcases the title, close, content and actions elements.</div>
  <div mat-dialog-actions>
    <button mat-button mat-dialog-close>Close</button>
  </div>`
})
export class DialogElementsExampleDialog {}
