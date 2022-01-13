import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { StoreTokenService } from './store-token.service';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  constructor(
    private httpClient: HttpClient,
    private commonService: CommonService
  ) {}

  getStoreDetailById(id) {
    return this.httpClient.get(this.commonService.envUrl() + 'storeById/' + id);
  }
  getExpectedPrice(data) {
    return this.httpClient.post(
      this.commonService.envUrl() + 'addDevice',
      data
    );
  }
  getTimeByDate(data) {
    return this.httpClient.post(this.commonService.envUrl() + 'slots', data);
  }
  addCartData(data) {
    return this.httpClient.post(this.commonService.envUrl() + 'cart', data);
  }
  getCartDetail() {
    return this.httpClient.get(this.commonService.envUrl() + 'cart');
  }
  placeOrder(data) {
    return this.httpClient.post(this.commonService.envUrl() + 'order', data);
  }
  getOrder(id) {
    return this.httpClient.get(this.commonService.envUrl() + 'order/' + id);
  }
  updateOrder(id, data) {
    return this.httpClient.get(
      this.commonService.envUrl() + 'order/' + id,
      data
    );
  }
  getAnoFee() {
    return this.httpClient.get(
      this.commonService.envUrl() + 'lookup?key=ANO_FEE'
    );
  }
  getBaseFee() {
    return this.httpClient.get(
      this.commonService.envUrl() + 'lookup?key=BASE_FEE'
    );
  }
  deleteCartData(id) {
    console.log(id);

    return this.httpClient.delete(this.commonService.envUrl() + 'cart/' + id);
  }

  getallstore(data) {
    return this.httpClient.post(
      this.commonService.envUrl() + 'filter/shop',
      data
    );
  }

  transaction(data) {
    return this.httpClient.post(
      this.commonService.envUrl() + 'transaction',
      data
    );
  }

  getShopifromcart(data) {
    return this.httpClient.post(
      this.commonService.envUrl() + 'cart/validate',
      data
    );
  }

  getmergeCart(data) {
    return this.httpClient.post(
      this.commonService.envUrl() + 'mergecart',
      data
    );
  }
}
