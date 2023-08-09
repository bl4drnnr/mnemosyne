import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { ALLOWED_METHODS } from '@interfaces/methods.type';
import { CONTROLLERS } from '@interfaces/controllers.type';
import { COMPANY_ENDPOINTS } from '@interfaces/company.endpoints';
import { CreateCompanyPayload } from '@payloads/create-company.payload';
import { CompanyCreatedResponse } from '@responses/company-created.response';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private readonly apiService: ApiService) {}

  createCompanyAccount(
    payload: CreateCompanyPayload
  ): Observable<{ message: CompanyCreatedResponse }> {
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.POST,
      controller: CONTROLLERS.COMPANY,
      action: COMPANY_ENDPOINTS.CREATE_COMPANY_ACCOUNT,
      payload
    });
  }
}
