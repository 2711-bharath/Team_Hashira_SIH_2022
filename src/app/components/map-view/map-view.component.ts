import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {
  map: mapboxgl.Map;
  businessTypes = [
    {
      value:"Education",
      show: false,
      icon: `<i class="fa-solid fa-school"></i>`
    },
    {
      value:"Hospital",
      show: false,
      icon: `<i class="fa-solid fa-hospital"></i>`
    },
    {
      value:"Residential",
      show: false,
      icon: `<i class="fas fa-building"></i>`
    },
    {
      value:"Restaurant",
      show: false,
      icon: `<i class="fa-solid fa-utensils"></i>`
    },
    {
      value:"Bus Stop",
      show: false,
      icon: `<i class="fa-solid fa-bus"></i>`
    },
    {
      value:"Hotels",
      show: false,
      icon: `<i class="fa-solid fa-hotel"></i>`
    },
    {
      value:"Cinema Theater",
      show: false,
      icon: `<i class="fas fa-film"></i>`
    },
    {
      value:"Railway Station",
      show: false,
      icon: `<i class="fa-solid fa-subway"></i>`
    },
  ]

  ngOnInit(): void {
    mapboxgl as typeof mapboxgl;
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map-view',
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });

    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }), 'top-left'
    );
  }

  onResize(event): void {
    const map_view = document.getElementById("map-view")
    map_view.style.height = "250px"
    map_view.style.width = `width: ${event.target.innerWidth}px`
  }


}
