import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StaticService {
  getMfaAuthApps() {
    return {
      google:
        'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&pli=1',
      microsoft:
        'https://support.microsoft.com/en-us/account-billing/download-and-install-the-microsoft-authenticator-app-351498fc-850a-45da-b7b6-27e523b8702a'
    };
  }
}
