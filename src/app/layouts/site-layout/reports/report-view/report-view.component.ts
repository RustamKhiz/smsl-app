import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-view',
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.css']
})
export class ReportViewComponent implements OnInit {

  constructor() { }

  reportView = JSON.parse(localStorage.getItem('ReportViewData'))
  // displayedColumns: string[] = ['demo-position', 'demo-name', 'demo-weight', 'demo-symbol'];
  ngOnInit() {
    console.log("reportView: ", this.reportView)
  }

}
