import {Component, OnDestroy, OnInit} from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { AutServices } from '../layouts/services/aut.services';
import {MaterialService} from 'src/app/layouts/classes/material.service'

@Component({
  selector: 'app-aut',
  templateUrl: './aut.component.html',
  styleUrls: ['./aut.component.css']
})


export class AutComponent implements OnInit, OnDestroy {
  title = 'Войти в личный кабинет';
  year: number = new Date().getFullYear();

  form: FormGroup 
  aSub: Subscription


  constructor(private aut: AutServices, private router: Router, private route: ActivatedRoute){

  }

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

    this.aSub = this.aut.login(this.form.value).subscribe(
       () => this.router.navigate(['/site']),
       error => {
         MaterialService.toast("Неверный логин или пароль")
         console.warn(error)
         this.form.enable()
       }
    )
  }
}

