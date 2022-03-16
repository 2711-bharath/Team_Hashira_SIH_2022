import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {
  map: mapboxgl.Map;

  ngOnInit(): void {
    mapboxgl as typeof mapboxgl;
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });

    // Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      })
    );
    
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        line_string: true,
        rectangle: true,
        point: true,
        polygon: true,
        trash: true,
      },
    });
    console.log(draw)
    this.map.addControl(draw, "top-right");
  }

}
