import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { StoreTokenService } from './store-token.service';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  constructor(
    private httpClient: HttpClient,
    private commonService: CommonService,
    private token: StoreTokenService
  ) {}

  public isAuthenticated(): boolean {
    const token = this.token.get('token');
    return !!token ? true : false;
  }
  logIn(data: any) {
    return this.httpClient.post(this.commonService.envUrl() + 'login', data);
  }
  getUserName() {
    return this.httpClient.get(this.commonService.envUrl() + 'user');
  }

  getEmail() {
    return this.httpClient.get(this.commonService.envUrl() + 'user');
  }

  getBrandList() {
    return this.httpClient.get(this.commonService.envUrl() + 'models');
  }
  getDeviceList(id) {
    return this.httpClient.get(
      this.commonService.envUrl() + 'problem/filter' + id
    );
  }
  getIssueListById(data) {
    return this.httpClient.post(this.commonService.envUrl() + 'problem', data);
  }

  getIssueList() {
    return this.httpClient.get(this.commonService.envUrl() + 'problem');
  }

  searchStore(data) {
    return this.httpClient.post(
      this.commonService.envUrl() + 'store/search',
      data
    );
  }

  filterDevice(data) {
    return this.httpClient.post(
      this.commonService.envUrl() + 'filter/device/Shop',
      data
    );
  }

  filterProblem(data) {
    return this.httpClient.post(
      this.commonService.envUrl() + 'filter/problem/Shop',
      data
    );
  }

  signUp(data) {
    return this.httpClient.post(this.commonService.envUrl() + 'register', data);
  }
  userAddress(data) {
    return this.httpClient.post(
      this.commonService.envUrl() + 'user/address',
      data
    );
  }
  checkEmail(data) {
    return this.httpClient.post(
      this.commonService.envUrl() + 'emailValidate',
      data
    );
  }

  generateOTP(data) {
    return this.httpClient.post(
      this.commonService.envUrl() + 'generateOTP',
      data
    );
  }

  resend(data) {
    return this.httpClient.post(
      this.commonService.envUrl() + 'resendOTP',
      data
    );
  }

  driverReq(data) {
    return this.httpClient.post(
      this.commonService.envUrl() + 'driverSignUpConfirmationEmail',
      data
    );
  }

  verifyOTP(data) {
    return this.httpClient.put(this.commonService.envUrl() + 'verifyOTP', data);
  }
  slider() {
    return this.httpClient.get(this.commonService.envUrl() + 'slider');
  }

  forgotpassword(data) {
    return this.httpClient.post(
      this.commonService.envUrl() + 'forgotPassword',
      data
    );
  }

  getAllCart(id, id2) {
    return this.httpClient.get(
      this.commonService.envUrl() + 'cart?user_id=' + id + '&cart_id=' + id2
    );
  }
}
