import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { CompanyEndpoint } from '@interfaces/company.enum';
import { CreateCompanyPayload } from '@payloads/create-company.interface';
import { CompanyCreatedResponse } from '@responses/company-created.enum';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private readonly apiService: ApiService) {}

  createCompanyAccount(
    payload: CreateCompanyPayload
  ): Observable<{ message: CompanyCreatedResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.COMPANY,
      action: CompanyEndpoint.CREATE_COMPANY_ACCOUNT,
      payload
    });
  }
}
