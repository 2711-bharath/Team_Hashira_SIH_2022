import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { environment } from '../../../environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register-business',
  templateUrl: './register-business.component.html',
  styleUrls: ['./register-business.component.scss']
})
export class RegisterBusinessComponent implements OnInit {
  isLoading = true;
  map: mapboxgl.Map;
  center = [78.3839, 17.537537];
  marker: any;
  businessForm = new FormGroup({})
  services = []
  req_proofs = []
  constructor(
    private storage: AngularFireStorage
  ) { }


  ngOnInit(): void {
    this.loadMap();
    this.businessForm = new FormGroup({
      name: new FormControl(),
      type: new FormControl(),
      address: new FormControl(),
      locality: new FormControl(),
      street: new FormControl(),
      city: new FormControl(),
      location: new FormControl(this.center),
      pincode: new FormControl(),
      services: new FormControl([]),
      images: new FormControl([])
    })

    this.services = [
      {
        name: "Wheel Chair",
        present: false
      },
      {
        name: "Helpers",
        present: false
      },
      {
        name: "Braille",
        present: false
      },
      {
        name: "Reserved Elevators",
        present: false
      },
      {
        name: "Reserved Parking",
        present: false
      },
      {
        name: "Provision of Carts",
        present: false
      },
      {
        name: "Ramps",
        present: false
      },
      {
        name: "Walking Sticks",
        present: false
      },
      {
        name: "Washrooms",
        present: false
      },
    ]
  }

  loadMap(): void {
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
        if (this.marker) {
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
    })
  }

  onResize(event): void {
    const map_inp = document.getElementById("map-input")
    map_inp.style.height = "250px"
    map_inp.style.width = `width: ${event.target.innerWidth}px`
  }

  updateService(index) {
    this.isLoading = true;
    this.services[index].present = !this.services[index].present
    if (this.services[index].present) {
      this.businessForm.value.services.push(this.services[index].name)
      this.req_proofs.push({
        forService: this.services[index].name,
        image: {},
        url: ""
      })
    } else {
      const idx = this.businessForm.value.services.indexOf(this.services[index].name)
      this.businessForm.value.services.splice(idx, 1)
      this.req_proofs.splice(idx, 1);
    }
    console.log(this.req_proofs)
    this.isLoading = false;
  }

  onFileSelect(event: Event, index) {
    const file = (event.target as HTMLInputElement).files![0];
    const selectedImage = (event.target as HTMLInputElement).files![0];
    console.log(selectedImage)
    const allowedFileType = ["image/png", "image/jpeg", "image/jpg"];
    if (file && allowedFileType.includes(file.type)) {
      this.req_proofs[index].image = selectedImage
    }
  }


  submitForm() {
    this.req_proofs.map((proof, i) => {
      if (proof.image && proof.image.name) {
        var filePath = `proofs/${proof.image.name}_${new Date().getTime()}`;
        const fileRef = this.storage.ref(filePath);
        this.storage.upload(filePath, proof.image).snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url)=>{
              this.addUrl(url, i)
            }
          )}
        ))
      }
    })
    this.businessForm.value.location = this.center;
  }

  addUrl(url, index) {
    this.req_proofs[index].url = url;
    console.log(url)
  }
}
