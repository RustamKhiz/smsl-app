import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile-red',
  templateUrl: './profile-red.component.html',
  styleUrls: ['./profile-red.component.css']
})
export class ProfileRedComponent implements OnInit {
  userData = JSON.parse(localStorage.getItem('UserData'))

  Name: string = this.userData.MyPerson.Personal.Name
  LastName: string = this.userData.MyPerson.Personal.LastName
  MidName: string = this.userData.MyPerson.Personal.MidName
  Telephone: string = this.userData.MyPerson.Personal.Telephone
  Position: string = this.userData.MyPerson.Personal.Position
  Id: string = this.userData.MyPerson.Personal.Id
  Fio: string = this.userData.MyPerson.Personal.Fio
  SmallFio: string = this.userData.MyPerson.Personal.SmalFio
  Organization: string = this.userData.MyPerson.Personal.Organization
  Inn: string = this.userData.MyPerson.Personal.Inn
  Adress: string = this.userData.MyPerson.Personal.Adress
  AccessLevel: string = this.userData.MyPerson.Personal.AccessLevel
  EMail: string = this.userData.MyPerson.Personal.EMail
  DefId: string = this.userData.MyPerson.Personal.DefId

  constructor() {}

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

  ngOnInit(): void {
    console.log("userData: ", this.userData)
  }

}
