import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HeaderService } from 'src/@theme/Services/header.service';
import { MapService } from 'src/@theme/Services/map.service';
import { ProfileService } from 'src/@theme/Services/profile.service';
import { StoreTokenService } from 'src/@theme/Services/store-token.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  nameSignUpFilled: boolean = false;
  signUpNameFlag: boolean = true;
  signUpMobileFlag: boolean = false;
  signUpConformationFlag: boolean = false;
  signUpEmailFlag: boolean = false;
  emailExist: boolean = false;
  signUpForm: FormGroup;
  otpForm: FormGroup;
  newmobile: any;
  displaymob: any;
  userAddres: FormGroup;
  userName: any;
  sId: any;
  // Checkotp:any;
  counter: number = 59;
  emptyOtpFlag: boolean = false;
  validOtpFlag: boolean = false;
  invalidOtp: boolean = false;
  resendOtpFlag: boolean = false;
  emptymobileFlag: boolean = false;
  alreadyregisterFlag: boolean = false;
  resenddoneFlag: boolean = false;
  addvalidnumFlag: boolean = false;
  addressLineFlag: boolean = false;
  cityFlag: boolean = false;
  stateFlag: boolean = false;
  zipCodeFlag: boolean = false;
  tempstate: string = '';
  addzero: string = '';
  Resend = {
    mobileNumber: '',
  };
  verification = {
    email: '',
    mobileNumber: '',
  };

  confirmOTP = {
    mobileNumber: '',
    otp: null,
  };
  email: any;
  mobile: any;
  formSubmitted: boolean = false;

  states: any[] = [];
  constructor(
    private activeModal: NgbActiveModal,
    private headerService: HeaderService,
    private storeTokenService: StoreTokenService,
    private modalService: NgbModal,
    private profile: ProfileService,
    private mapService: MapService
  ) {}

  ngOnInit(): void {
    this.states = this.profile.getstatelist();

    this.getData();
  }

  getData() {
    this.signUpForm = new FormGroup({
      fname: new FormControl(null, Validators.required),
      lname: new FormControl(null, Validators.required),
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/
        ),
      ]),
      mobileNumber: new FormControl(null),
      password: new FormControl(null, Validators.required),
      role: new FormControl('user'),
    });

    this.otpForm = new FormGroup({
      otp: new FormControl(null, Validators.required),
    });

    this.userAddres = new FormGroup({
      fname: new FormControl(null, Validators.required),
      lname: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      phoneNumber: new FormControl(null),
      addressLine: new FormControl(null, Validators.required),
      zipCode: new FormControl(null, Validators.required),
      message: new FormControl(null),
      city: new FormControl(null, Validators.required),
      state: new FormControl(null, Validators.required),
      latitude: new FormControl(null, Validators.required),
      longitude: new FormControl(null, Validators.required),
    });
  }

  checkEmail() {
    this.emailExist = false;
    let emailObj = {
      email: this.signUpForm.value.email,
    };
    this.headerService.checkEmail(emailObj).subscribe(
      (data) => {
        if (data['data'] == 1) {
          this.emailExist = true;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  signUpNameComplete() {
    this.nameSignUpFilled = true;

    if (this.signUpForm.valid && !this.emailExist) {
      if (
        this.signUpForm.value.fname &&
        this.signUpForm.value.lname &&
        this.signUpForm.value.email &&
        this.signUpForm.value.password
      ) {
        this.signUpNameFlag = false;
        this.signUpMobileFlag = true;

        this.userAddres.value.fname = this.signUpForm.value.fname;
        this.userAddres.value.lname = this.signUpForm.value.lname;

        console.log(this.userAddres.value);

        localStorage.setItem('signUp', JSON.stringify(this.signUpForm.value));
      } else {
        return;
      }
    }
  }

  openLogIn() {
    this.activeModal.close();
    this.modalService.open(LoginComponent);
  }

  signUpMobilePrevious() {
    this.signUpNameFlag = true;
    this.signUpMobileFlag = false;
  }

  signUpMobilePreviouss() {
    this.signUpMobileFlag = true;
    this.signUpConformationFlag = false;
  }
  signUpMobileComplete() {
    this.addvalidnumFlag = false;
    this.alreadyregisterFlag = false;

    if (this.signUpForm.value.mobileNumber) {
      this.email = this.signUpForm.value.email;
      this.mobile = this.signUpForm.value.mobileNumber;

      console.log(this.signUpForm.value);

      localStorage.setItem('signUp', JSON.stringify(this.signUpForm.value));

      var string = this.mobile;

      string = string.replace('(', '');
      string = string.replace(')', '');
      string = string.replace('-', '');

      for (var i = 0; i < string.length; i++) {
        const item: any = string[i];
        console.log(item);

        if (!isNaN(item)) {
        } else {
          string = string.replace(item, '');
        }
      }
      console.log(string);

      this.displaymob = this.convertmobile(string);
      this.newmobile = string;
      this.verification.email = this.signUpForm.value.email;
      this.verification.mobileNumber = this.newmobile;

      this.signUpForm.value.mobileNumber = this.newmobile;

      console.log(this.verification);

      this.headerService.generateOTP(this.verification).subscribe(
        (response) => {
          console.log('get otp ', response);
          if (response['status'] == 200) {
            this.sId = response['data']['sId'];

            this.signUpMobileFlag = false;
            this.signUpConformationFlag = true;

            if (this.signUpConformationFlag) {
              this.startCountdown(this.counter);
            } else {
              return;
            }
          }
        },
        (error) => {
          console.log(error.error);

          if (
            error.error['status'] == 422 &&
            error.error['message'] ==
              'The mobile number has already been taken.'
          ) {
            this.alreadyregisterFlag = true;
          }

          if (error.error['status'] == 400) {
            this.addvalidnumFlag = true;
          }
        }
      );

      if (this.signUpConformationFlag) {
        this.startCountdown(this.counter);
      } else {
        return;
      }
    } else {
      this.emptymobileFlag = true;
    }
  }

  convertmobile(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ')' + match[2] + '-' + match[3];
    }
    return null;
  }

  close() {
    this.activeModal.close();
  }

  resend() {
    if (this.resendOtpFlag) {
      this.Resend.mobileNumber = this.newmobile;
      console.log(this.Resend);
      this.startCountdown(this.counter);

      this.headerService.resend(this.Resend).subscribe(
        (response) => {
          if (
            response['status'] == 200 &&
            response['message'] == 'otp send Successfully'
          ) {
            console.log('resend otp', response);
            this.resenddoneFlag = true;
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.log('wait for a while');
    }
  }
  startCountdown(seconds) {
    this.counter = seconds;

    const interval = setInterval(() => {
      if (this.counter > 0) {
        this.counter--;
      }
      if (this.counter < 10) {
        this.addzero = '0';
        console.log(this.counter);

        if (this.counter == 0) {
          clearInterval(interval);

          this.resendOtpFlag = true;
        }
      }
    }, 1000);
  }

  // checkotp(otp){

  //   this.Checkotp = otp
  // }

  signUpConfirmationComplete() {
    this.emptyOtpFlag = false;
    this.validOtpFlag = false;
    this.invalidOtp = false;

    if (this.otpForm.value.otp) {
      if (this.otpForm.value.otp.length == 4) {
        this.validOtpFlag = false;
        this.emptyOtpFlag = false;
        console.log(this.otpForm.value.otp.length);

        this.confirmOTP.mobileNumber = this.verification.mobileNumber;
        this.confirmOTP.otp = this.otpForm.value.otp;

        console.log(this.confirmOTP);

        // if ((this.confirmOTP.otp.length < 4)) {
        //   if (this.confirmOTP.otp.length == 0) {
        //     this.emptyOtpFlag = true;
        //     this.validOtpFlag = false;
        //   } else {
        //     this.emptyOtpFlag = false;
        //     this.validOtpFlag = true;
        //   }
        // } else {
        this.headerService.verifyOTP(this.confirmOTP).subscribe(
          (response) => {
            console.log('verify', response);

            if (response['status'] == 200) {
              console.log('otp done');

              this.signUpConformationFlag = false;
              this.signUpEmailFlag = true;
            }
          },
          (error) => {
            console.log(error);
            if (
              error.error['status'] == 422 &&
              error.error['message'] == 'invalid OTP'
            ) {
              this.invalidOtp = true;
            }
          }
        );
      } else {
        this.validOtpFlag = true;
        this.emptyOtpFlag = false;
        this.invalidOtp = false;
      }
    } else {
      this.emptyOtpFlag = true;
      this.validOtpFlag = false;
      this.invalidOtp = false;
    }
    // }
  }
  setUserName() {
    this.headerService.getUserName().subscribe(
      (data) => {
        this.userName = data['data'].name;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  signUpEmailPrevious() {
    this.signUpConformationFlag = true;
    this.signUpEmailFlag = false;
  }

  setstate(event) {
    console.log(event);
    this.tempstate = event;
    console.log(this.tempstate);
  }

  signUpEmailComplete() {
    this.addressLineFlag = false;
    this.cityFlag = false;
    this.zipCodeFlag = false;
    this.stateFlag = false;
    if (this.tempstate != '') {
      this.userAddres.value.state = this.tempstate;
    }
    console.log(this.userAddres.value);

    if (
      this.userAddres.value.addressLine &&
      this.userAddres.value.city &&
      this.userAddres.value.state &&
      this.userAddres.value.zipCode
    ) {
      this.userAddres.value.email = this.email;
      this.userAddres.value.phoneNumber = this.newmobile;

      this.userAddres.value.fname = this.signUpForm.value.fname;
      this.userAddres.value.lname = this.signUpForm.value.lname;

      var area =
        this.userAddres.value.addressLine +
        ' ' +
        this.userAddres.value.city +
        ' ' +
        this.userAddres.value.state +
        ' ' +
        this.userAddres.value.zipCode;
      console.log(area);

      this.mapService.getlatlong(area).subscribe((data: any) => {
        console.log(data);

        if (data['status'] == 'OK') {
          this.userAddres.value.latitude =
            data.results[0].geometry.location.lat;
          this.userAddres.value.longitude =
            data.results[0].geometry.location.lng;

          console.log(this.userAddres.value);
          console.log(this.signUpForm.value);

          this.headerService.signUp(this.signUpForm.value).subscribe(
            (data) => {
              console.log(data);
              if (data['status'] == 200) {
                this.storeTokenService.set('token', data['data'].access_token);
                this.setUserName();

                console.log(this.userAddres.value);
                this.headerService.userAddress(this.userAddres.value).subscribe(
                  (data) => {
                    console.log(data);
                    console.log(data['data'].fname);
                    console.log(data['data'].user_id);

                    this.storeTokenService.set('user_id', data['data'].user_id);

                    if (data['status'] == 200) {
                      this.activeModal.close(data['data']);
                    }
                  },
                  (error) => {
                    console.log(error);
                  }
                );
              }
            },
            (error) => {
              console.log(error);
            }
          );
        }
      });
    } else {
      console.log(this.userAddres.value);

      if (this.userAddres.value.addressLine == null) {
        this.addressLineFlag = true;
      }

      if (this.userAddres.value.city == null) {
        this.cityFlag = true;
      }
      if (this.userAddres.value.state == null) {
        this.stateFlag = true;
      }
      if (this.userAddres.value.zipCode == null) {
        this.zipCodeFlag = true;
      }
    }
  }
}
