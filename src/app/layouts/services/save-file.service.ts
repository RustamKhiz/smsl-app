import { Injectable } from "@angular/core";
import {Personals, User} from "./interfaces";
import {HttpClient} from '@angular/common/http'
import {from, Observable} from "rxjs";
import {map, tap} from "rxjs/operators"
import{environment} from "src/environments/environment"

@Injectable({
  providedIn: 'root'
})
export class SaveFile{

  constructor(private http: HttpClient) {
  }
  downloadFile(data) {
    const blob = new Blob([data], { type: 'text/csv' });
    const url= window.URL.createObjectURL(blob);
    window.open(url);
  }
  saveFile(path):  Observable<any>{
    return this.http.get(`${environment.apiUrl}/api/cloud/getfile?path=${path.FullPath}`, {
      responseType: 'blob'
    })


    // var fl = {"Path": path};
  //  console.log("fl", fl)
    // window.location.href=`${environment.apiUrl}/api/cloud/getfile=${path.FullPath}`;
    // let downloadLink = document.createElement('a');
    // downloadLink.href = `${environment.apiUrl}/api/cloud/getfile=${path}`;
    // downloadLink.download = `${environment.apiUrl}/api/cloud/getfile=${path}`;
    // // if (filename)
    // //     downloadLink.setAttribute('download', filename);
    // document.body.appendChild(downloadLink);

   // downloadLink.click();


    // this.http.get(`${environment.apiUrl}/api/cloud/getfile=${path}`).subscribe( (response) =>
    // {
    //   console.log("work")
    //   //let dataType = response.type;
    //    // let binaryData = [];
    //    // binaryData.push(response);
    //     let downloadLink = document.createElement('a');
    //     downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
    //     // if (filename)
    //     //     downloadLink.setAttribute('download', filename);
    //     document.body.appendChild(downloadLink);
    //     downloadLink.click();
    // },
    // () => console.log("dont work")
    // )



  }

}
