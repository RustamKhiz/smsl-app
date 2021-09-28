import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-red',
  templateUrl: './profile-red.component.html',
  styleUrls: ['./profile-red.component.css']
})
export class ProfileRedComponent implements OnInit {
  public Name: string
  public LastName: string
  public MidName: string
  public Telephone: string
  public Position: string
  public Id: string
  constructor() {
    this.Name = localStorage.getItem('Name');
    this.LastName = localStorage.getItem('LastName');
    this.MidName = localStorage.getItem('MidName');
    this.Telephone = localStorage.getItem('Telephone');
    this.Position = localStorage.getItem('Position');
    this.Id = localStorage.getItem('Id');
  }

  ngOnInit(): void {
  }

}
