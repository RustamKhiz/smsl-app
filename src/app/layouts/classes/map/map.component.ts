import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor() { }
  placemarkProperties1: ymaps.IPlacemarkProperties = {
    hintContent: 'Екатеринбург',
    balloonContent: 'Екатеринбург',
  };

  placemarkProperties2: ymaps.IPlacemarkProperties = {
    hintContent: 'Туапсе',
    balloonContent: 'Туапсе',
  };

  placemarkProperties3: ymaps.IPlacemarkProperties = {
    hintContent: 'Свободный',
    balloonContent: 'Свободный',
  };

  placemarkProperties4: ymaps.IPlacemarkProperties = {
    hintContent: 'Колпино',
    balloonContent: 'Колпино',
  };

  placemarkProperties5: ymaps.IPlacemarkProperties = {
    hintContent: 'Грязовец',
    balloonContent: 'Грязовец',
  };

  placemarkProperties6: ymaps.IPlacemarkProperties = {
    hintContent: 'Ковытка',
    balloonContent: 'Ковытка',
  };


  placemarkOptions: ymaps.IPlacemarkOptions = {
    iconLayout: 'default#image',
    iconImageHref:
      'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
    iconImageSize: [32, 32],
  };

  test(){
    console.log("test")
  }
  ngOnInit(): void {
  }

}
