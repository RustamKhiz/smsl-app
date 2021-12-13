import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core'
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { AutServices } from '../layouts/services/aut.services';
import {MaterialService, OpenSnack} from 'src/app/layouts/classes/material.service'
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Personals, User} from "../layouts/services/interfaces";
import {afterlogServices} from "../layouts/services/afterlog.services";
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-aut',
  templateUrl: './aut.component.html',
  styleUrls: ['./aut.component.css', 'aut-media.component.css']
})


export class AutComponent implements OnInit, OnDestroy {
  title = 'Войдите, чтобы продолжить';
  year: number = new Date().getFullYear();
  hide = true;
  //Объявление для считывания формы авторизации
  // form: FormGroup
  aSub: Subscription
  afterSub: Subscription
  test: string
  matcher = new MyErrorStateMatcher();
  constructor(private aut: AutServices, private router: Router, private route: ActivatedRoute, private afteraut: afterlogServices, private snackBar: MatSnackBar, public dialog: MatDialog){

  }
  loading: boolean = false;
  UserNameCtrl: FormControl = new FormControl(null, [Validators.required])
  PasswordCtrl: FormControl =new FormControl (null, [Validators.required])
  ngOnInit(){
  //  this.openDialog()

    this.route.queryParams.subscribe( (params: Params)  => {
      if (params['accessDenied']){
        this.openSnackBar("Для начала авторизуйтесь в системе", "Ok")
      }
    })
  }
  openSnackBar(message: string, action: string) {

    this.snackBar.open(message, action, {
      duration: 3000
    });
  }
  ngOnDestroy(){
    if (this.aSub){
      this.aSub.unsubscribe()
    }
  }

  onSubmit(){
    // this.form.disable()
    this.loading = true;
    const formData = {
      UserName: this.UserNameCtrl.value,
      Password: this.PasswordCtrl.value
    }
    this.aSub = this.aut.login(formData).subscribe(
       (User) => {
        this.loading = false;
        console.log("Данные пользователя: ", User)
        const userData = JSON.stringify(User)
        localStorage.setItem('UserData', userData)
        console.log("AccessLevel: ", User.MyPerson.Personal.AccessLevel)
        const userAccessLevel = JSON.stringify(User.MyPerson.Personal.AccessLevel)
        localStorage.setItem('AccessLevel', userAccessLevel)
        this.router.navigate(['/site'])
        localStorage.setItem('reloadItem', "1")

        },
       error => {
         this.loading = false;
         this.openSnackBar("Неверный логин или пароль", "Ok")
         console.warn(error)
       },
       () => {

       }
    )
  }
  openDialog() {
    this.dialog.open(DialogElementsExampleDialog);
  }
}

@Component({
  selector: 'dialog-elements-example-dialog',
  templateUrl: '../layouts/classes/dialog/dialog-info/dialog-info.component.html',
})
export class DialogElementsExampleDialog {}
