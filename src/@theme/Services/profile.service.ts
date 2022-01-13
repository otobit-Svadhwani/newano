import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from './common.service';
import { StoreTokenService } from './store-token.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  public getaddressid: number = 0;

  public getShopid: number = 0;
  public checkdelete: boolean = false;

  states: any[] = [
    {
      name: 'Alabama',
      abbreviation: 'AL',
    },
    {
      name: 'Alaska',
      abbreviation: 'AK',
    },
    {
      name: 'American Samoa',
      abbreviation: 'AS',
    },
    {
      name: 'Arizona',
      abbreviation: 'AZ',
    },
    {
      name: 'Arkansas',
      abbreviation: 'AR',
    },
    {
      name: 'California',
      abbreviation: 'CA',
    },
    {
      name: 'Colorado',
      abbreviation: 'CO',
    },
    {
      name: 'Connecticut',
      abbreviation: 'CT',
    },
    {
      name: 'Delaware',
      abbreviation: 'DE',
    },
    {
      name: 'District Of Columbia',
      abbreviation: 'DC',
    },
    {
      name: 'Federated States Of Micronesia',
      abbreviation: 'FM',
    },
    {
      name: 'Florida',
      abbreviation: 'FL',
    },
    {
      name: 'Georgia',
      abbreviation: 'GA',
    },
    {
      name: 'Guam',
      abbreviation: 'GU',
    },
    {
      name: 'Hawaii',
      abbreviation: 'HI',
    },
    {
      name: 'Idaho',
      abbreviation: 'ID',
    },
    {
      name: 'Illinois',
      abbreviation: 'IL',
    },
    {
      name: 'Indiana',
      abbreviation: 'IN',
    },
    {
      name: 'Iowa',
      abbreviation: 'IA',
    },
    {
      name: 'Kansas',
      abbreviation: 'KS',
    },
    {
      name: 'Kentucky',
      abbreviation: 'KY',
    },
    {
      name: 'Louisiana',
      abbreviation: 'LA',
    },
    {
      name: 'Maine',
      abbreviation: 'ME',
    },
    {
      name: 'Marshall Islands',
      abbreviation: 'MH',
    },
    {
      name: 'Maryland',
      abbreviation: 'MD',
    },
    {
      name: 'Massachusetts',
      abbreviation: 'MA',
    },
    {
      name: 'Michigan',
      abbreviation: 'MI',
    },
    {
      name: 'Minnesota',
      abbreviation: 'MN',
    },
    {
      name: 'Mississippi',
      abbreviation: 'MS',
    },
    {
      name: 'Missouri',
      abbreviation: 'MO',
    },
    {
      name: 'Montana',
      abbreviation: 'MT',
    },
    {
      name: 'Nebraska',
      abbreviation: 'NE',
    },
    {
      name: 'Nevada',
      abbreviation: 'NV',
    },
    {
      name: 'New Hampshire',
      abbreviation: 'NH',
    },
    {
      name: 'New Jersey',
      abbreviation: 'NJ',
    },
    {
      name: 'New Mexico',
      abbreviation: 'NM',
    },
    {
      name: 'New York',
      abbreviation: 'NY',
    },
    {
      name: 'North Carolina',
      abbreviation: 'NC',
    },
    {
      name: 'North Dakota',
      abbreviation: 'ND',
    },
    {
      name: 'Northern Mariana Islands',
      abbreviation: 'MP',
    },
    {
      name: 'Ohio',
      abbreviation: 'OH',
    },
    {
      name: 'Oklahoma',
      abbreviation: 'OK',
    },
    {
      name: 'Oregon',
      abbreviation: 'OR',
    },
    {
      name: 'Palau',
      abbreviation: 'PW',
    },
    {
      name: 'Pennsylvania',
      abbreviation: 'PA',
    },
    {
      name: 'Puerto Rico',
      abbreviation: 'PR',
    },
    {
      name: 'Rhode Island',
      abbreviation: 'RI',
    },
    {
      name: 'South Carolina',
      abbreviation: 'SC',
    },
    {
      name: 'South Dakota',
      abbreviation: 'SD',
    },
    {
      name: 'Tennessee',
      abbreviation: 'TN',
    },
    {
      name: 'Texas',
      abbreviation: 'TX',
    },
    {
      name: 'Utah',
      abbreviation: 'UT',
    },
    {
      name: 'Vermont',
      abbreviation: 'VT',
    },
    {
      name: 'Virgin Islands',
      abbreviation: 'VI',
    },
    {
      name: 'Virginia',
      abbreviation: 'VA',
    },
    {
      name: 'Washington',
      abbreviation: 'WA',
    },
    {
      name: 'West Virginia',
      abbreviation: 'WV',
    },
    {
      name: 'Wisconsin',
      abbreviation: 'WI',
    },
    {
      name: 'Wyoming',
      abbreviation: 'WY',
    },
  ];
  private adminheader = new HttpHeaders({
    Accept: 'application/json',
    'content-Type': 'application/json',
  });
  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private token: StoreTokenService
  ) {}

  public geteditid = new BehaviorSubject(this.getaddressid);
  responseeditId = this.geteditid.asObservable();

  public CheckDelete = new BehaviorSubject(this.checkdelete);
  responsedelete = this.CheckDelete.asObservable();

  public getshopid = new BehaviorSubject(this.getShopid);
  responseShopId = this.getshopid.asObservable();

  public isAuthenticated(): boolean {
    const token = this.token.get('token');
    return !!token ? true : false;
  }

  public getAdminHeaders(): HttpHeaders {
    this.adminheader = new HttpHeaders({
      Authorization: 'Bearer' + localStorage.getItem('token'),
    });
    return this.adminheader;
  }

  getEditId(data) {
    this.geteditid.next(data);
  }

  getCheckdelete(data) {
    this.CheckDelete.next(data);
  }
  getShopId(data) {
    this.getshopid.next(data);
  }
  getOrderlist() {
    return this.http.get(this.commonService.envUrl() + 'orderList', {
      headers: this.getAdminHeaders(),
    });
  }

  getsingleOrder(id) {
    return this.http.get(this.commonService.envUrl() + 'order/' + id, {
      headers: this.getAdminHeaders(),
    });
  }

  getUserDetail() {
    return this.http.get(this.commonService.envUrl() + 'user', {
      headers: this.getAdminHeaders(),
    });
  }

  changepassword(data) {
    return this.http.post(this.commonService.envUrl() + 'changePassword', data);
  }

  SubmitReview(data, id) {
    return this.http.post(
      this.commonService.envUrl() + 'store' + '/' + id + '/' + 'ratings',
      data,
      {
        headers: this.getAdminHeaders(),
      }
    );
  }

  getAlladdress() {
    return this.http.get(this.commonService.envUrl() + 'user/address', {
      headers: this.getAdminHeaders(),
    });
  }
  changeDetail(data) {
    return this.http.put(this.commonService.envUrl() + 'profile', data, {
      headers: this.getAdminHeaders(),
    });
  }

  addAddress(data) {
    return this.http.post(this.commonService.envUrl() + 'user/address', data, {
      headers: this.getAdminHeaders(),
    });
  }

  getAddressbyID(id) {
    return this.http.get(this.commonService.envUrl() + 'user/address/' + id, {
      headers: this.getAdminHeaders(),
    });
  }

  putAddressbyID(data, id) {
    return this.http.put(
      this.commonService.envUrl() + 'user/address/' + id,
      data,
      {
        headers: this.getAdminHeaders(),
      }
    );
  }
  makedefault(id, data) {
    console.log(this.commonService.envUrl() + 'user/address/makedefault/' + id);
    return this.http.put(
      this.commonService.envUrl() + 'user/address/makedefault/' + id,
      data,
      {
        headers: this.getAdminHeaders(),
      }
    );
  }

  getstatelist() {
    return this.states;
  }

  deleteaddress(id) {
    return this.http.delete(
      this.commonService.envUrl() + 'user/address/' + id,
      {
        headers: this.getAdminHeaders(),
      }
    );
  }

  trackservice(id) {
    return this.http.get(this.commonService.envUrl() + 'track/' + id);
  }
}
