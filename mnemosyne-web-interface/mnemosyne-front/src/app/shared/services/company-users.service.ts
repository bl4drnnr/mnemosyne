import { ApiService } from '@shared/api.service';
import { Injectable } from '@angular/core';
import { InviteUserPayload } from '@payloads/invite-user.interface';
import { Observable } from 'rxjs';
import { UserInvitedResponse } from '@responses/user-invited.enum';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { CompanyUsersEndpoint } from '@interfaces/company-users.enum';
import { CompanyMemberInfoInterface } from '@payloads/company-member-info.interface';
import { CompanyMemberInfoResponse } from '@responses/company-member-info.interface';
import { UpdateUserInfoPayload } from '@payloads/update-user-info.interface';
import { UserUpdatedResponse } from '@responses/user-updated.enum';
import { DeleteCompanyMemberPayload } from '@payloads/delete-company-member.interface';
import { CompanyMemberDeletedResponse } from '@responses/company-member-deleted.enum';
import { SearchCompanyMemberPayload } from '@payloads/search-company-member.interface';

@Injectable({
  providedIn: 'root'
})
export class CompanyUsersService {
  constructor(private readonly apiService: ApiService) {}

  inviteUserToCompany(
    payload: InviteUserPayload
  ): Observable<{ message: UserInvitedResponse }> {
    const language = localStorage.getItem('translocoLang');

    if (language) payload.language = language;

    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.COMPANY_USERS,
      action: CompanyUsersEndpoint.INVITE_USER,
      payload
    });
  }

  getCompanyMemberInformation({
    memberId
  }: CompanyMemberInfoInterface): Observable<CompanyMemberInfoResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.COMPANY_USERS,
      action: CompanyUsersEndpoint.COMPANY_MEMBER_INFO,
      params: { memberId }
    });
  }

  updateCompanyMemberInformation(
    payload: UpdateUserInfoPayload
  ): Observable<{ message: UserUpdatedResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.PATCH,
      controller: Controller.COMPANY_USERS,
      action: CompanyUsersEndpoint.COMPANY_MEMBER_INFO,
      params: { memberId: payload.memberId },
      payload
    });
  }

  deleteCompanyMember(
    payload: DeleteCompanyMemberPayload
  ): Observable<{ message: CompanyMemberDeletedResponse }> {
    const { memberId } = payload;
    const language = localStorage.getItem('translocoLang');

    if (language) payload.language = language;

    return this.apiService.apiProxyRequest({
      method: Method.DELETE,
      controller: Controller.COMPANY_USERS,
      action: CompanyUsersEndpoint.DELETE_COMPANY_MEMBER,
      params: { memberId },
      payload
    });
  }

  searchCompanyMember(
    payload: SearchCompanyMemberPayload
  ): Observable<SearchCompanyMemberPayload> {
    const { query } = payload;

    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.COMPANY_USERS,
      action: CompanyUsersEndpoint.SEARCH_COMPANY_MEMBER,
      params: { query }
    });
  }
}
