import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { CompanyEndpoint } from '@interfaces/company.enum';
import { CreateCompanyPayload } from '@payloads/create-company.interface';
import { CompanyCreatedResponse } from '@responses/company-created.enum';
import { GetCompanyByIdInterface } from '@payloads/get-company-by-id.interface';
import { GetCompanyInfoByIdInterface } from '@responses/get-company-by-id.interface';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private readonly apiService: ApiService) {}

  createCompanyAccount(
    payload: CreateCompanyPayload
  ): Observable<{ message: CompanyCreatedResponse }> {
    const language = localStorage.getItem('translocoLang');

    if (language) payload.language = language;

    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.COMPANY,
      action: CompanyEndpoint.CREATE_COMPANY_ACCOUNT,
      payload
    });
  }

  getCompanyInformationById({
    companyId,
    page,
    pageSize
  }: GetCompanyByIdInterface): Observable<GetCompanyInfoByIdInterface> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.COMPANY,
      action: CompanyEndpoint.GET_COMPANY_INFORMATION_BY_ID,
      params: { companyId, page, pageSize }
    });
  }

  saveCompanyInformation() {}
}
