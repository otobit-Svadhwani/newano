import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StoreTokenService {
  constructor() {}

  set(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  get(KEY: string) {
    return localStorage.getItem(KEY);
  }

  remove(Key: string) {
    localStorage.removeItem(Key);
  }
}
