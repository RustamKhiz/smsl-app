import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-red',
  templateUrl: './profile-red.component.html',
  styleUrls: ['./profile-red.component.css']
})
export class ProfileRedComponent implements OnInit {
  userData = JSON.parse(localStorage.getItem('UserData'))

  Name: string = ""
  LastName: string = ""
  MidName: string = ""
  Telephone: string = ""
  Position: string = ""
  Id: string = ""
  constructor() {}

  ngOnInit(): void {
    this.Name = this.userData.MyPerson.Personal.Name
    this.LastName = this.userData.MyPerson.Personal.LastName
    this.MidName = this.userData.MyPerson.Personal.MidName
    this.Telephone = this.userData.MyPerson.Personal.Telephone
    this.Position = this.userData.MyPerson.Personal.Position
    this.Id = this.userData.MyPerson.Personal.Id
  }

}
