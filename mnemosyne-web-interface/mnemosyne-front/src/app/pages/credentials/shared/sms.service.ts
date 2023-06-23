import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { ResendLoginSmsPayload } from '@payloads/resend-login-sms.payload';
import { Observable } from 'rxjs';
import { SendSmsCodeResponse } from '@responses/send-sms-code.response';

@Injectable({
  providedIn: 'root'
})
export class SmsService {
  constructor(private apiService: ApiService) {}

  resendLoginSms({
    email,
    password
  }: ResendLoginSmsPayload): Observable<{ message: SendSmsCodeResponse }> {
    return this.apiService.apiProxyRequest({
      method: 'POST',
      controller: 'security',
      action: 'resend-login-sms',
      payload: { email, password }
    });
  }
}
