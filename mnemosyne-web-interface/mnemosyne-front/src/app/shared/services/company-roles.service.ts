import { ApiService } from '@shared/api.service';
import { CreateCompanyRoleInterface } from '@payloads/create-company-role.interface';
import { Observable } from 'rxjs';
import { CompanyRoleCreatedResponse } from '@responses/company-role-created.enum';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { CompanyRolesEndpoint } from '@interfaces/company-roles.enum';
import { UpdateCompanyRolePayload } from '@payloads/update-company-role.interface';
import { CompanyRoleUpdatedResponse } from '@responses/company-role-updated.enum';
import { DeleteCompanyRolePayload } from '@payloads/delete-company-role.interface';
import { CompanyRoleDeletedResponse } from '@responses/company-role-deleted.enum';
import { AssignCompanyRoleIPayload } from '@payloads/assign-company-role.interface';
import { CompanyRoleAssignedResponse } from '@responses/company-role-assigned.enum';
import { Injectable } from '@angular/core';
import { RevokeCompanyRolePayload } from '@payloads/revoke-company-role.interface';
import { CompanyRoleRevokedResponse } from '@responses/company-role-revoked.enum';

@Injectable({
  providedIn: 'root'
})
export class CompanyRolesService {
  constructor(private readonly apiService: ApiService) {}

  createCompanyRole(
    payload: CreateCompanyRoleInterface
  ): Observable<{ message: CompanyRoleCreatedResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.COMPANY_ROLES,
      action: CompanyRolesEndpoint.CREATE_ROLE,
      payload
    });
  }

  updateCompanyRole(
    payload: UpdateCompanyRolePayload
  ): Observable<{ message: CompanyRoleUpdatedResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.PATCH,
      controller: Controller.COMPANY_ROLES,
      action: CompanyRolesEndpoint.UPDATE_ROLE,
      payload
    });
  }

  deleteCompanyRole(
    payload: DeleteCompanyRolePayload
  ): Observable<{ message: CompanyRoleDeletedResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.DELETE,
      controller: Controller.COMPANY_ROLES,
      action: CompanyRolesEndpoint.DELETE_ROLE,
      payload
    });
  }

  assignCompanyMemberRole(
    payload: AssignCompanyRoleIPayload
  ): Observable<{ message: CompanyRoleAssignedResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.PATCH,
      controller: Controller.COMPANY_ROLES,
      action: CompanyRolesEndpoint.ASSIGN_ROLE,
      payload
    });
  }

  revokeCompanyMemberRole(
    payload: RevokeCompanyRolePayload
  ): Observable<{ message: CompanyRoleRevokedResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.PATCH,
      controller: Controller.COMPANY_ROLES,
      action: CompanyRolesEndpoint.REVOKE_ROLE,
      payload
    });
  }
}
