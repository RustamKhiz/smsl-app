import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SaveFile } from 'src/app/layouts/services/save-file.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-report-view',
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.css']
})
export class ReportViewComponent implements OnInit {

  constructor(private saveFile: SaveFile) { }

  reportView = JSON.parse(localStorage.getItem('ReportViewData'))
  displayedColumns = ['№', 'MethodControl', 'Customer.NameRu', 'reportView.CwrWorks.CwrWorkPersonals', 'reportView.CwrWorks.CwrWorkEquipments', 'Shown', 'Made', 'Comment'];
  displayedColumns2 = ['№', 'Personal.Fio', 'CwrStatusFromPersonals', 'Comment'];
  displayedColumns3 = ['№', 'Equipment', 'Status', 'Comment'];
  displayedColumns4 = ['№', 'DisplayName', 'Size', 'Save'];

  saveFileSub: Subscription
  SaveFile(i){
    console.log("this.reportView[i].FullPath: ", this.reportView.CwrFiles[i].FullPath)
    const linkSource = `${environment.apiUrl}/api/cwr/getfile?id=${this.reportView.CwrFiles[i].Id}`
    const downloadLink = document.createElement("a");
    const fileName = this.reportView.CwrFiles[i].DisplayName

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
    // this.saveFile.saveFile(this.reportView.CwrFiles[i]).subscribe(blob => {
    //   const a = document.createElement('a')
    //   const objectUrl = URL.createObjectURL(blob)
    //   a.href = objectUrl
    //   a.download =  this.reportView.CwrFiles[i].OriginalName;
    //   a.click();
    //   URL.revokeObjectURL(objectUrl);
    // })
  }
  // const linkSource = `${environment.apiUrl}/api/cwr/getfile?id=${this.reportView.CwrFiles[i].Id}`
  // const downloadLink = document.createElement("a");
  // const fileName = this.reportView.CwrFiles[i].DisplayName

  // downloadLink.href = linkSource;
  // downloadLink.download = fileName;
  // downloadLink.click();
  ngOnInit() {
    console.log("reportView: ", this.reportView)
  }

}
