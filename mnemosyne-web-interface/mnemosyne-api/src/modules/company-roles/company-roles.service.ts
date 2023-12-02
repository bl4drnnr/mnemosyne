import { Injectable } from '@nestjs/common';
import { CreateCompanyRoleInterface } from '@interfaces/create-company-role.interface';
import { UpdateCompanyRoleInterface } from '@interfaces/update-company-role.interface';
import { DeleteCompanyRoleInterface } from '@interfaces/delete-company-role.interface';
import { AssignRoleInterface } from '@interfaces/assign-role.interface';
import { RevokeRoleInterface } from '@interfaces/revoke-role.interface';
import { CompanyRoleAssignedDto } from '@dto/company-role-assigned.dto';
import { CompanyRoleCreatedDto } from '@dto/company-role-created.dto';
import { CompanyRoleDeletedDto } from '@dto/company-role-deleted.dto';
import { CompanyRoleRevokedDto } from '@dto/company-role-revoked.dto';
import { CompanyRoleUpdatedDto } from '@dto/company-role-updated.dto';

@Injectable()
export class CompanyRolesService {
  constructor() {}

  createCompanyRole({ companyId, payload, trx }: CreateCompanyRoleInterface) {
    return new CompanyRoleCreatedDto();
  }

  updateCompanyRole({ companyId, payload, trx }: UpdateCompanyRoleInterface) {
    return new CompanyRoleUpdatedDto();
  }

  deleteCompanyRole({ companyId, payload, trx }: DeleteCompanyRoleInterface) {
    return new CompanyRoleDeletedDto();
  }

  assignRoleToUser({ companyId, payload, trx }: AssignRoleInterface) {
    return new CompanyRoleAssignedDto();
  }

  revokeUserRole({ companyId, payload, trx }: RevokeRoleInterface) {
    return new CompanyRoleRevokedDto();
  }
}
