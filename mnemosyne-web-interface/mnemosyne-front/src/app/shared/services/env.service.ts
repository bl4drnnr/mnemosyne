import { Injectable } from '@angular/core';
import { environment } from '@env/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  get getFrontProxyUrl() {
    return environment.apiUrl;
  }

  get getStaticStorageLink() {
    return environment.staticStorage;
  }
}
