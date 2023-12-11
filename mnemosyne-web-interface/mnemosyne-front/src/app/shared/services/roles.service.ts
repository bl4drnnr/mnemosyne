import { ApiService } from '@shared/api.service';
import { CreateCompanyRolePayload } from '@payloads/create-company-role.interface';
import { Observable } from 'rxjs';
import { CompanyRoleCreatedResponse } from '@responses/company-role-created.enum';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { RolesEndpoint } from '@interfaces/roles.enum';
import { UpdateCompanyRolePayload } from '@payloads/update-company-role.interface';
import { CompanyRoleUpdatedResponse } from '@responses/company-role-updated.enum';
import { DeleteCompanyRolePayload } from '@payloads/delete-company-role.interface';
import { CompanyRoleDeletedResponse } from '@responses/company-role-deleted.enum';
import { AssignCompanyRolePayload } from '@payloads/assign-company-role.interface';
import { CompanyRoleAssignedResponse } from '@responses/company-role-assigned.enum';
import { Injectable } from '@angular/core';
import { RevokeCompanyRolePayload } from '@payloads/revoke-company-role.interface';
import { CompanyRoleRevokedResponse } from '@responses/company-role-revoked.enum';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  constructor(private readonly apiService: ApiService) {}

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

  deleteCompanyRole(
    payload: DeleteCompanyRolePayload
  ): Observable<{ message: CompanyRoleDeletedResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.DELETE,
      controller: Controller.ROLES,
      action: RolesEndpoint.DELETE_ROLE,
      payload
    });
  }

  assignCompanyMemberRole(
    payload: AssignCompanyRolePayload
  ): Observable<{ message: CompanyRoleAssignedResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.PATCH,
      controller: Controller.ROLES,
      action: RolesEndpoint.ASSIGN_ROLE,
      payload
    });
  }

  revokeCompanyMemberRole(
    payload: RevokeCompanyRolePayload
  ): Observable<{ message: CompanyRoleRevokedResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.PATCH,
      controller: Controller.ROLES,
      action: RolesEndpoint.REVOKE_ROLE,
      payload
    });
  }
}
