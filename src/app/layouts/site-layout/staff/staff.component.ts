import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Personals } from '../../services/interfaces';
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit, AfterViewInit, OnDestroy {
  // staffDataStart = JSON.parse(localStorage.getItem('Personal'))
  staffData = JSON.parse(localStorage.getItem('Personal'))
  staff: any [] = []
  constructor( private snackBar: MatSnackBar, private changeDetectorRef: ChangeDetectorRef) {
    // this.appendItems(0, this.sum);
   }
   @ViewChild(MatPaginator) paginator: MatPaginator;

  obs: Observable<any>;
  dataSource: MatTableDataSource<Personals>

  sum = 6;
  throttle = 500;
  scrollDistance = 1;

  // addItems(startIndex, endIndex) {
  //   for (let i = startIndex; i < endIndex; i++) {
  //     this.staff.push(this.staffData[i]);
  //   }
  // }
  // appendItems(startIndex, endIndex) {
  //   this.addItems(startIndex, endIndex);
  // }
  // onScrollDown(ev) {
  //   console.log('scrolled down!!', ev);
  //   const start = this.sum;
  //   this.sum += 3;
  //   this.appendItems(start, this.sum);
  // }
  ConnectToPagginList(){
    this.dataSource = new MatTableDataSource<Personals>(this.staff);
    this.changeDetectorRef.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.obs = this.dataSource.connect();
  }
  ngOnInit() {
    for (let i = 0; i < this.staffData.length; i++) {
      if (this.staffData[i].StatusWork == "Работает" ){
        this.staff.push(this.staffData[i])
      }
    }
    this.ConnectToPagginList()

    this.filterStatusCtrl.setValue("Работает")
  }
  ngAfterViewInit() {

  }
  filterNameCtrl: FormControl = new FormControl(null)
  filterStatusCtrl: FormControl = new FormControl(null)
  FilterSubmit(){
    console.log("this.filterName.value: ", this.filterNameCtrl.value)
    console.log("filterStatusCtrl: ", this.filterStatusCtrl)
    console.log("filterStatusCtrl: ", this.filterStatusCtrl.value)

    if (this.filterStatusCtrl.value == "Работает"){

    }

    if ((this.filterNameCtrl.value !== null) && (this.filterNameCtrl.value !== " ")){
      this.staff = []
      for (let i = 0; i <  this.staffData.length; i++) {
        if ((this.filterNameCtrl.value == this.staffData[i].Fio) || (this.filterNameCtrl.value == this.staffData[i].Name) || (this.filterNameCtrl.value == this.staffData[i].LastName)){
          this.staff.push(this.staffData[i])
          this.ConnectToPagginList()

        }

      }
      console.log("this.staffData: ",  this.staff)


    }else if ( ((this.filterNameCtrl.value == null) || (this.filterNameCtrl.value == " ")) && (this.filterStatusCtrl.value == "Работает")) {
      this.staff = []

      for (let i = 0; i <  this.staffData.length; i++){
        if (this.staffData[i].StatusWork == "Работает"){
          this.staff.push(this.staffData[i])
          console.log("test!!!")
          console.log("staff: ", this.staff)
        }
      }

      this.openSnackBar("Введите имя!", "Ок")
    }
    this.filterNameCtrl.reset()
  }
  FilterClear(){
    this.staff = this.staffData
    this.ConnectToPagginList()
    this.filterStatusCtrl.reset()
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }
  persLogoLarge(pers){
    let logoAdress;

    if (pers.IsLogo == true){
      logoAdress = `${environment.apiUrl}/api/personal/logo?id=${pers.Id}&size=middle&base64=false`
      return logoAdress
    } else {
      logoAdress = "../../../../assets/profile.png"
      return logoAdress
    }
  }
  getPersTel(tel){
    let telError = "Номер скрыт"
    if (tel == ""){
      return telError
    }else {
      return tel
    }
  }
  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }
}
