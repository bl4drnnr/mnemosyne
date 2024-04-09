import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { CompanyEndpoint } from '@interfaces/company.enum';
import { CreateCompanyPayload } from '@payloads/create-company.interface';
import { CompanyCreatedResponse } from '@responses/company-created.enum';
import { GetCompanyInfoByIdResponse } from '@responses/get-company-by-id.interface';
import { UpdateCompanyInfoPayload } from '@payloads/update-company-info.interface';
import { CompanyInfoUpdatedResponse } from '@responses/company-info-updated.enum';
import { GetCompanyUsersPayload } from '@payloads/get-company-users.interface';
import { GetCompanyUsersResponse } from '@responses/get-company-users-res.interface';
import { CompanyOwnershipTransferredResponse } from '@responses/company-ownership-transferred.enum';
import { TransferCompanyOwnershipPayload } from '@payloads/transfer-company-ownership.interface';
import { DeleteCompanyPayload } from '@payloads/delete-company.interface';
import { CompanyDeletedResponse } from '@responses/company-deleted.enum';
import { GetCompanyPublicInfoPayload } from '@payloads/get-company-public-info.interface';
import { GetCompanyPublicInfoInfoResponse } from '@responses/get-company-public-info.interface';

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

  getCompanyInformationById(): Observable<GetCompanyInfoByIdResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.COMPANY,
      action: CompanyEndpoint.GET_COMPANY_INFORMATION_BY_ID
    });
  }

  getCompanyPublicInformation(
    params: GetCompanyPublicInfoPayload
  ): Observable<GetCompanyPublicInfoInfoResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.COMPANY,
      action: CompanyEndpoint.COMPANY_PUBLIC_INFORMATION,
      params
    });
  }

  getCompanyUsers(
    params: GetCompanyUsersPayload
  ): Observable<GetCompanyUsersResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.COMPANY,
      action: CompanyEndpoint.GET_COMPANY_USERS,
      params
    });
  }

  saveCompanyInformation(
    payload: UpdateCompanyInfoPayload
  ): Observable<{ message: CompanyInfoUpdatedResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.PATCH,
      controller: Controller.COMPANY,
      action: CompanyEndpoint.UPDATE_COMPANY_INFORMATION,
      payload
    });
  }

  transferCompanyOwnership(
    payload: TransferCompanyOwnershipPayload
  ): Observable<{ message: CompanyOwnershipTransferredResponse }> {
    const language = localStorage.getItem('translocoLang');

    if (language) payload.language = language;

    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.COMPANY,
      action: CompanyEndpoint.TRANSFER_OWNERSHIP,
      payload
    });
  }

  deleteCompany(
    payload: DeleteCompanyPayload
  ): Observable<{ message: CompanyDeletedResponse }> {
    const language = localStorage.getItem('translocoLang');

    if (language) payload.language = language;

    return this.apiService.apiProxyRequest({
      method: Method.DELETE,
      controller: Controller.COMPANY,
      action: CompanyEndpoint.DELETE_COMPANY,
      payload
    });
  }
}
