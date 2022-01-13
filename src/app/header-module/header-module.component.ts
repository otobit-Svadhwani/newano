import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HeaderService } from 'src/@theme/Services/header.service';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { BookRepairComponent } from './book-repair/book-repair.component';
import { EmptycartComponent } from './emptycart/emptycart.component';
import { StoreTokenService } from 'src/@theme/Services/store-token.service';
import { MapService } from 'src/@theme/Services/map.service';
import { Router } from '@angular/router';

declare var gtag;

@Component({
  selector: 'app-header-module',
  templateUrl: './header-module.component.html',
  styleUrls: ['./header-module.component.css'],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class HeaderModuleComponent implements OnInit {
  @ViewChild('toggleButton', { static: false }) toggleButton: ElementRef;
  @ViewChild('menu', { static: false }) menu: ElementRef;
  @ViewChild('userProfile', { static: false }) userProfile: ElementRef;
  @ViewChild('drop', { static: false }) drop: ElementRef;
  userName: any = '';
  Phonenumber: any = '';

  isModalOpen: boolean = false;
  Location = {
    lat: null,
    lng: null,
  };
  area: any;
  area2: any;
  isMobile;
  constructor(
    private modalService: NgbModal,
    private headerService: HeaderService,
    private storeTokenService: StoreTokenService,
    public router: Router,
    private renderer: Renderer2,
    private _eref: ElementRef,
    private mapService: MapService
  ) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (
        e.target !== this.toggleButton.nativeElement &&
        e.target !== this.menu.nativeElement
      ) {
        this.isMenuOpen = false;
      }

      if (
        e.target !== this.toggleButton.nativeElement &&
        e.target !== this.menu.nativeElement &&
        e.target == this.userProfile.nativeElement
      ) {
        this.isMenuOpen = true;
      }
      if (
        e.target == this.userProfile.nativeElement &&
        e.target == this.drop.nativeElement
      ) {
        this.isopenDropdown = true;
      }
    });
  }
  isMenuOpen = false;
  isopenDropdown = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  openDropdown() {
    this.isopenDropdown = !this.isopenDropdown;
  }

  onClick(event) {
    // for close dropdown on outside dropdown click
    if (!this._eref.nativeElement.contains(event.target)) {
      this.isopenDropdown = false;
    }
  }
  ngOnInit() {
    this.Location = JSON.parse(localStorage.getItem('Location') || '[]');

    this.mapService.getArea(this.Location.lat, this.Location.lng).subscribe(
      (data: any) => {
        this.area = data.results[0].formatted_address;
        this.area2 = this.area.slice(0, 35);
        localStorage.setItem('Address', JSON.stringify(this.area));

        console.log(this.area);
      },
      (error) => {
        console.log(error);
      }
    );

    this.headerService.getUserName().subscribe(
      (data) => {
        console.log(data, 'newone');
        if (data['data'] == null) {
        }
        this.userName = data['data'].fname;

        this.Phonenumber = this.convertmobile(data['data'].mobileNumber);
      },
      (error) => {
        console.log(error);
      }
    );

    navigator.geolocation.getCurrentPosition((position) => {
      this.Location.lat = position.coords.latitude;
      this.Location.lng = position.coords.longitude;
      console.log(this.Location);

      localStorage.setItem('Location', JSON.stringify(this.Location));
      this.Location = JSON.parse(localStorage.getItem('Location') || '[]');

      this.mapService.getArea(this.Location.lat, this.Location.lng).subscribe(
        (data: any) => {
          this.area = data.results[0].formatted_address;
          this.area2 = this.area.slice(0, 30);
          localStorage.setItem('Address', JSON.stringify(this.area));

          console.log(this.area);
        },
        (error) => {
          console.log(error);
        }
      );
    });
  }
  // formatDevice() {
  //   this.expandPanel = this.isTablet = this.isMobile = this.isCollapsed=false;
  //   if (window.innerWidth >= 1024) {
  //     this.expandPanel = true;
  //     //document.getElementById("navUl").classList.remove("navbar-nav")
  //     console.log("expand",this.expandPanel)
  //     this.isCollapsed=false
  //     console.log(this.isCollapsed)
  //   } else if (window.innerWidth >= 767 && window.innerWidth < 1024) {
  //     this.isTablet = true;
  //     console.log("tablet",this.isTablet)
  //     this.isCollapsed=true
  //   } else {
  //     this.isMobile = true;
  //     console.log("mobile",this.isMobile)
  //     this.isCollapsed=true
  //   }
  //   if (
  //     window.innerWidth > window.innerHeight &&
  //     window.innerWidth >= 640 &&
  //     (this.isMobile || this.isTablet)
  //   ) {
  //     this.isMobile = this.isTablet = false;
  //     this.isCollapsed=false
  //     this.expandPanel = true;
  //   }

  // }

  convertmobile(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ')' + match[2] + '-' + match[3];
    }
    return null;
  }

  logIn() {
    this.isopenDropdown = false;
    this.userName = null;
    if (this.modalService.hasOpenModals()) {
      this.modalService.dismissAll();
    }
    const modalRef = this.modalService.open(LoginComponent);
    modalRef.result.then((result) => {
      console.log(result);
      console.log(result.userDetails['mobileNumber']);

      this.Phonenumber = this.convertmobile(result.userDetails['mobileNumber']);

      this.setUserName();
    });
  }
  setUserName() {
    this.headerService.getUserName().subscribe(
      (data) => {
        console.log(data);
        console.log(data['data'].id);

        this.userName = data['data'].fname;
        this.storeTokenService.set('user_id', data['data'].id);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  signUp() {
    this.isopenDropdown = false;

    if (this.modalService.hasOpenModals()) {
      this.modalService.dismissAll();
    }
    const modalRef = this.modalService.open(SignupComponent);
    modalRef.result.then((result) => {
      console.log(result);

      this.userName = result['fname'];
      this.Phonenumber = this.convertmobile(result['phoneNumber']);
      console.log(this.Phonenumber);
    });
  }

  onhome() {
    this.isopenDropdown = false;

    this.router.navigate(['/']);
  }
  onContact() {
    this.isopenDropdown = false;

    this.router.navigate(['contact']);
  }

  nearby() {
    this.isopenDropdown = false;

    this.router.navigate(['filterShop']);
    gtag('event', 'Proceed_BUTTON_CLICKED', {
      event_category: 'BUTTON_CLICK',
      event_label: 'Track Me Click',
      value: 'User visit NearByStore',
    });
  }
  account() {
    this.router.navigate(['profile']);
    this.isopenDropdown = !this.isopenDropdown;
  }
  cart() {
    var id = JSON.parse(localStorage.getItem('user_id') || '0');
    var id2 = JSON.parse(localStorage.getItem('Tempcart') || '0');
    this.headerService.getAllCart(id, id2).subscribe(
      (response) => {
        console.log(response);

        if (response['message'] == 'Cart is Empty') {
          this.modalService.open(EmptycartComponent);
        } else {
          this.isopenDropdown = !this.isopenDropdown;
          this.router.navigate(['cart']);
          this.isopenDropdown = !this.isopenDropdown;
        }
      },
      (error) => {
        console.log(error);
      }
    );

    // this.isopenDropdown = !this.isopenDropdown;

    // this.router.navigate(['cart']);
  }
  service() {
    this.isopenDropdown = !this.isopenDropdown;

    this.router.navigate(['profile/service']);
  }
  onabout() {
    this.isopenDropdown = false;

    this.router.navigate(['about']);
  }
  bookRepair() {
    this.isopenDropdown = false;

    if (this.modalService.hasOpenModals()) {
      this.modalService.dismissAll();
    }
    const modalRef = this.modalService.open(BookRepairComponent);
    gtag('event', 'Proceed_BUTTON_CLICKED', {
      event_category: 'BUTTON_CLICK',
      event_label: 'Track Me Click',
      value: 'User visit BookRepair',
    });
  }

  logout() {
    this.storeTokenService.remove('token');
    this.storeTokenService.remove('user_id');

    this.isopenDropdown = !this.isopenDropdown;
    this.userName = null;
    this.router.navigate(['home']);
  }
}
