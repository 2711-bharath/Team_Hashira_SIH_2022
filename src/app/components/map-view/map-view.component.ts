import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment';
import { RegisterBusinessService } from 'src/app/services/register-business.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {
  map: mapboxgl.Map;
  businessTypes = [
    {
      value: "Education",
      show: false,
      icon: `<i class="fa-solid fa-school"></i>`
    },
    {
      value: "Hospital",
      show: false,
      icon: `<i class="fa-solid fa-hospital"></i>`
    },
    {
      value: "Residential",
      show: false,
      icon: `<i class="fas fa-building"></i>`
    },
    {
      value: "Restaurant",
      show: false,
      icon: `<i class="fa-solid fa-utensils"></i>`
    },
    {
      value: "Bus Stop",
      show: false,
      icon: `<i class="fa-solid fa-bus"></i>`
    },
    {
      value: "Hotels",
      show: false,
      icon: `<i class="fa-solid fa-hotel"></i>`
    },
    {
      value: "Cinema Theater",
      show: false,
      icon: `<i class="fas fa-film"></i>`
    },
    {
      value: "Railway Station",
      show: false,
      icon: `<i class="fa-solid fa-subway"></i>`
    },
  ]
  resData: any;
  filteredData = [];
  markers: Array<mapboxgl.Marker> = [];

  constructor(
    private db: AngularFirestore,
    private service: RegisterBusinessService
  ) { }

  ngOnInit(): void {
    this.service.getAllProviders().subscribe(res => {
      this.resData = res;
      this.loadMap();
    })

  }
  loadMap() {
    mapboxgl as typeof mapboxgl;
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map-view',
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [78.3839, 17.537537], // starting position [lng, lat]
      zoom: 10, // starting zoom
    });
    // Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }), 'top-left'
    );
    this.loadMarkers()
  }

  loadMarkers() {
    this.markers.forEach(marker => {
      marker.remove();
    })
    this.markers = []
    if (this.filteredData.length === 0) {
      console.log(this.resData)
      this.resData.map(data => {
        // const geocoder = new MapboxGeocoder({
        //   accessToken: environment.mapbox.accessToken,
        //   mapboxgl: mapboxgl,
        //   marker: false,
        // });
        const popup = new mapboxgl.Popup({ offset: 35 }).setHTML(
          `
              <style>
                .card{
                  background-color
                }
              </style>
              <div class="card" style="width: 12rem;">
                <img class="card-img-top" src="${data.images[0].url}" alt="Card image cap">
                <div class="card-body">
                  <h5 class="card-title">${data.name}</h5>
                  <p class="card-text">${data.address}</p>
                  <p>Services:${data.services.map(s => { return s })}</p>
                </div>
              </div>
            `
        );
        var marker = new mapboxgl.Marker({
          draggable: false,
          color: "#D80739",
        }).setLngLat(data.location).addTo(this.map).setPopup(popup);
        this.markers.push(marker)
      })
    } else {
      this.resData.map(data => {
        let idx = this.filteredData.indexOf(data.type);
        if (idx > -1) {
          const popup = new mapboxgl.Popup({ offset: 35 }).setHTML(
            `
                <style>
                  .card{
                    background-color
                  }
                </style>
                <div class="card" style="width: 12rem;">
                  <img class="card-img-top" src="${data.images[0].url}" alt="Card image cap">
                  <div class="card-body">
                    <h5 class="card-title">${data.name}</h5>
                    <p class="card-text">${data.address}</p>
                    <p>Services:${data.services.map(s => { return s })}</p>
                  </div>
                </div>
              `
          );
          var marker = new mapboxgl.Marker({
            draggable: false,
            color: "#D80739",
          }).setLngLat(data.location).addTo(this.map).setPopup(popup);
          this.markers.push(marker)
        }
      })
    }
  }

  onResize(event): void {
    const map_view = document.getElementById("map-view")
    map_view.style.height = "250px"
    map_view.style.width = `width: ${event.target.innerWidth}px`
  }

  filterData(type: string) {
    this.filteredData = []
    this.businessTypes = this.businessTypes.filter(business => {
      if (business.value === type) {
        business.show = !business.show
      }
      if (business.show) {
        this.filteredData.push(business.value)
      }
      return business;
    })
    console.log(this.filteredData);
    console.log(this.markers)
    this.loadMarkers();
  }
}
