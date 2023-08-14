import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { MethodsEnum } from '@interfaces/methods.enum';
import { ControllersEnum } from '@interfaces/controllers.enum';
import { CompanyEnum } from '@interfaces/company.enum';
import { CreateCompanyInterface } from '@payloads/create-company.interface';
import { CompanyCreatedEnum } from '@responses/company-created.enum';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private readonly apiService: ApiService) {}

  createCompanyAccount(
    payload: CreateCompanyInterface
  ): Observable<{ message: CompanyCreatedEnum }> {
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.POST,
      controller: ControllersEnum.COMPANY,
      action: CompanyEnum.CREATE_COMPANY_ACCOUNT,
      payload
    });
  }
}
