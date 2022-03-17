import { Component, OnInit } from '@angular/core';
import { CountryCode, CountryCodes } from '../../data/country-codes';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { WindowService } from '../../services/window.service';
import { RecaptchaVerifier, getAuth } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  country_codes: Array<CountryCode> = CountryCodes;
  loginForm = new FormGroup({});
  submitted = false;
  windowRef: any;
  auth: any
  showOTPOpt:boolean = false;

  constructor(private win: WindowService, private authService: AuthService, private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      country_code: new FormControl('+91', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      verification_code: new FormControl('', [Validators.minLength(6)])
    })
    this.windowRef = this.win.windowRef
    const app = initializeApp(environment.firebaseConfig);
    this.auth = getAuth(app);
    this.windowRef.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', { 'size': 'invisible' }, this.auth);

    this.windowRef.recaptchaVerifier
      .render()
      .then(widgetId => {
        this.windowRef.recaptchaWidgetId = widgetId
      });
  }

  generateOTP() {
    this.submitted = true;
    if (!this.loginForm.get('phone').errors) {
      const appVerifier = this.windowRef.recaptchaVerifier;
      const mobile = this.loginForm.value.country_code + this.loginForm.value.phone;
      this.authService.sendOTP(this.auth, mobile, appVerifier).subscribe(res => {
        if(res.status === 'successfull') {
          this.windowRef.confirmationResult = res.message
          this.showOTPOpt = true;
          this.loginForm.controls['phone'].disable();
          this.loginForm.controls['country_code'].disable();
        } else {
          this.toastrService.error(res.message, 'Error')
        }
      })
      console.log(appVerifier, mobile)
    }
  }

  verifyOTP() {
    console.log(this.loginForm.value.verification_code)
    if(this.loginForm.value.verification_code.length === 6) {
      this.windowRef.confirmationResult
      .confirm(this.loginForm.value.verification_code)
      .then( result => {
        localStorage.setItem('userId', result.user.uid)
        localStorage.setItem('loggedInToAccessableMap', "true")
        this.toastrService.success("Loggedin Successfully", "Successfull")
      })
      .catch( error => this.toastrService.error("Incorrect code entered?", "Error"));
    } else {
      this.toastrService.warning("Enter valid code", "Warning")
    }
  }
}
