import { Injectable } from '@angular/core';
import { ApplicationVerifier, signInWithPhoneNumber } from "firebase/auth";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  sendOTP(auth, phone: string, appVerifier: ApplicationVerifier): Observable<any> {
    return new Observable(sub => {
      signInWithPhoneNumber(auth,phone, appVerifier).then((confirmationResult) => {
        sub.next({status: "successfull", message: confirmationResult})
      }).catch((err) => {
        sub.next({status: "error", message: err.message})
      })
    })
  }

  get isLoggedIn(): boolean {
    return Boolean(localStorage.getItem('loggedInToAccessableMap')) === true ? true : false;
  }

  logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('loggedInToAccessableMap');
  }

}
