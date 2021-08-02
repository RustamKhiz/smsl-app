import { Component, OnInit } from '@angular/core';
import { AutServices } from './layouts/services/aut.services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private aut: AutServices){

  }

  ngOnInit(){
    const potentialToken = localStorage.getItem('aut-token')
    if (potentialToken !== null){
      this.aut.setToken(potentialToken)
    }
  }
}
