import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { AutServices } from '../layouts/services/aut.services';
import {MaterialService} from 'src/app/layouts/classes/material.service'
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Personals, User} from "../layouts/services/interfaces";
import {afterlogServices} from "../layouts/services/afterlog.services";

@Component({
  selector: 'app-aut',
  templateUrl: './aut.component.html',
  styleUrls: ['./aut.component.css']
})


export class AutComponent implements OnInit, OnDestroy {
  title = 'Войти в личный кабинет';
  year: number = new Date().getFullYear();

  //Объявление для считывания формы авторизации
  form: FormGroup
  aSub: Subscription
  afterSub: Subscription
  test: string

  constructor(private aut: AutServices, private router: Router, private route: ActivatedRoute, private afteraut: afterlogServices){

  }
  loading: boolean = false;
  ngOnInit(){
    this.form = new FormGroup({
      UserName: new FormControl(null, [Validators.required, Validators.email]),
      Password: new FormControl (null, [Validators.required, Validators.minLength(6)])
    })

    this.route.queryParams.subscribe( (params: Params)  => {
      if (params['accessDenied']){
        MaterialService.toast("Для начала авторизуйтесь в системе")
      }
    })

  }

  ngOnDestroy(){
    if (this.aSub){
      this.aSub.unsubscribe()
    }
  }

  onSubmit(){
    this.form.disable()
    this.loading = true;
    this.aSub = this.aut.login(this.form.value).subscribe(
       (User) => {
        this.loading = false;
        console.log("Данные пользователя: ", User)
        const userData = JSON.stringify(User)
        localStorage.setItem('UserData', userData)
        console.log("AccessLevel: ", User.MyPerson.Personal.AccessLevel)
        const userAccessLevel = JSON.stringify(User.MyPerson.Personal.AccessLevel)
        localStorage.setItem('AccessLevel', userAccessLevel)
        this.router.navigate(['/site'])

        },
       error => {
         this.loading = false;
         MaterialService.toast("Неверный логин или пароль")
         console.warn(error)
         this.form.enable()
       }
    )
    // this.afteraut.afterLog(this.form.value).subscribe(
    //   ()=> console.log("afterlog working!"),
    //     error => {
    //     console.log("afterlog dont work")
    //   }
    //   )
  }
}

