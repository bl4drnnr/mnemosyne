import { ApiService } from '@shared/api.service';
import { CreateCompanyRolePayload } from '@payloads/create-company-role.interface';
import { Observable } from 'rxjs';
import { CompanyRoleCreatedResponse } from '@responses/company-role-created.enum';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { RolesEndpoint } from '@interfaces/roles.enum';
import { UpdateCompanyRolePayload } from '@payloads/update-company-role.interface';
import { CompanyRoleUpdatedResponse } from '@responses/company-role-updated.enum';
import { AssignCompanyRolePayload } from '@payloads/assign-company-role.interface';
import { CompanyRoleAssignedResponse } from '@responses/company-role-assigned.enum';
import { Injectable } from '@angular/core';
import { GetCompanyRolesPayload } from '@responses/get-company-roles.interface';
import { CompanyRoleType } from '@interfaces/company-role.type';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  constructor(private readonly apiService: ApiService) {}

  getCompanyRoles(): Observable<GetCompanyRolesPayload> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.ROLES,
      action: RolesEndpoint.GET_COMPANY_ROLES
    });
  }

  createCompanyRole(
    payload: CreateCompanyRolePayload
  ): Observable<{ message: CompanyRoleCreatedResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.ROLES,
      action: RolesEndpoint.CREATE_ROLE,
      payload
    });
  }

  updateCompanyRole(
    payload: UpdateCompanyRolePayload
  ): Observable<{ message: CompanyRoleUpdatedResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.PATCH,
      controller: Controller.ROLES,
      action: RolesEndpoint.UPDATE_ROLE,
      payload
    });
  }

  changeCompanyMemberRole(
    payload: AssignCompanyRolePayload
  ): Observable<{ message: CompanyRoleAssignedResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.PATCH,
      controller: Controller.ROLES,
      action: RolesEndpoint.CHANGE_COMPANY_MEMBER_ROLE,
      payload
    });
  }
}
