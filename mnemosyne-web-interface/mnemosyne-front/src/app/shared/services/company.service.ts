import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { CompanyEndpoint } from '@interfaces/company.enum';
import { CreateCompanyPayload } from '@payloads/create-company.interface';
import { CompanyCreatedResponse } from '@responses/company-created.enum';
import { GetCompanyInfoByIdInterface } from '@responses/get-company-by-id.interface';
import { UpdateCompanyInfoInterface } from '@payloads/update-company-info.interface';
import { CompanyInfoUpdatedEnum } from '@responses/company-info-updated.enum';
import { GetCompanyUsersInterface } from '@payloads/get-company-users.interface';
import { GetCompanyUsersResInterface } from '@responses/get-company-users-res.interface';
import { CompanyOwnershipTransferredEnum } from '@responses/company-ownership-transferred.enum';
import { TransferCompanyOwnershipInterface } from '@payloads/transfer-company-ownership.interface';

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

  getCompanyInformationById(): Observable<GetCompanyInfoByIdInterface> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.COMPANY,
      action: CompanyEndpoint.GET_COMPANY_INFORMATION_BY_ID,
      accessToken
    });
  }

  getCompanyUsers({
    page,
    pageSize
  }: GetCompanyUsersInterface): Observable<GetCompanyUsersResInterface> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.COMPANY,
      action: CompanyEndpoint.GET_COMPANY_USERS,
      params: { page, pageSize },
      accessToken
    });
  }

  saveCompanyInformation(
    payload: UpdateCompanyInfoInterface
  ): Observable<{ message: CompanyInfoUpdatedEnum }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: Method.PATCH,
      controller: Controller.COMPANY,
      action: CompanyEndpoint.UPDATE_COMPANY_INFORMATION,
      payload,
      accessToken
    });
  }

  transferCompanyOwnership(
    payload: TransferCompanyOwnershipInterface
  ): Observable<{ message: CompanyOwnershipTransferredEnum }> {
    const accessToken = localStorage.getItem('_at')!;
    const language = localStorage.getItem('translocoLang');

    if (language) payload.language = language;

    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.COMPANY,
      action: CompanyEndpoint.TRANSFER_OWNERSHIP,
      payload,
      accessToken
    });
  }
}
