import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { MethodsEnum } from '@interfaces/methods.enum';
import { ControllersEnum } from '@interfaces/controllers.enum';
import { CompanyEnum } from '@interfaces/company.enum';
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
      method: MethodsEnum.POST,
      controller: ControllersEnum.COMPANY,
      action: CompanyEnum.CREATE_COMPANY_ACCOUNT,
      payload
    });
  }
}
