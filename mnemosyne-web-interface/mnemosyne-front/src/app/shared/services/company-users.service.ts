import { ApiService } from '@shared/api.service';
import { Injectable } from '@angular/core';
import { InviteUserPayload } from '@payloads/invite-user.interface';

@Injectable({
  providedIn: 'root'
})
export class CompanyUsersService {
  constructor(private readonly apiService: ApiService) {}

  inviteUserToCompany(payload: InviteUserPayload) {
    const language = localStorage.getItem('translocoLang');

    if (language) payload.language = language;
  }
}
