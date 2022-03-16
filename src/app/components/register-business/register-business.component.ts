import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register-business',
  templateUrl: './register-business.component.html',
  styleUrls: ['./register-business.component.scss']
})
export class RegisterBusinessComponent implements OnInit {
  map: mapboxgl.Map;
  center = [78.3839, 17.537537];
  marker: any;

  ngOnInit(): void {
    mapboxgl as typeof mapboxgl;
    this.map = new mapboxgl.Map({
      height: "100%",
      width: "100%",
      accessToken: environment.mapbox.accessToken,
      container: 'map-input',
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: this.center, // starting position [lng, lat]
      zoom: 15, // starting zoom
    });

    this.map.on('load', () => {
      this.map.resize();
    })

    const geocoder = new MapboxGeocoder({
      accessToken: environment.mapbox.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
    });
    this.map.addControl(geocoder, 'top-left');
    
    this.marker = new mapboxgl.Marker({
      draggable: true,
      color: "#D80739",
    }).setLngLat(this.center).addTo(this.map);

    // search bar to map
    geocoder.on("result", (e) => {
      this.center = e.result.center;
      if(this.marker) {
        this.marker.remove();
      }
      this.marker = new mapboxgl.Marker({
        draggable: true,
        color: "#D80739",
      }).setLngLat(e.result.center).addTo(this.map);
      this.marker.on("dragend", (e) => {
        this.center = Object.values(e.target.getLngLat())
        this.marker.setLngLat(this.center).addTo(this.map);
      });
    });
  }

  onResize(event) {
    const map_inp = document.getElementById("map-input")
    map_inp.style.height = "250px"
    map_inp.style.width = `width: ${event.target.innerWidth}px`
    // console.log(event.target.innerWidth)
  }
}
