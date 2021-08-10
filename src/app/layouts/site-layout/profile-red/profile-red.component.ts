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
  constructor() {
    this.Name = localStorage.getItem('Name');
    this.LastName = localStorage.getItem('LastName');
    this.MidName = localStorage.getItem('MidName');
  }

  ngOnInit(): void {
  }

}
