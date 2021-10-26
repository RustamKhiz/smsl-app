// import { Injectable } from '@angular/core';
// import { Subject } from 'rxjs';
// import { AllUsers } from '../services/interfaces'
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { environment } from 'src/environments/environment';
// import { AllEquipment } from '../services/interfaces'

// @Injectable({ providedIn: 'root' })
// export class session {
//   constructor(private http: HttpClient) {


//   }

//   public AllUsers: AllUsers[];
//   public CurrentPage = new Subject<any>();
//   public Status = new Subject<any>();
//   private isLoad: boolean = false;

//   setCurrPage(page: string) {
//     this.CurrentPage.next({text: page});
//   }

//   setStatusText(str: string) {
//     this.Status.next({text: str});
//   }

//   loadData() {
//     if (this.isLoad === false) {

//       this.isLoad = true
//     }
//   }
// }
