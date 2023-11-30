import { Injectable } from '@nestjs/common';
import { CreateCompanyRoleInterface } from '@interfaces/create-company-role.interface';
import { UpdateCompanyRoleInterface } from '@interfaces/update-company-role.interface';
import { DeleteCompanyRoleInterface } from '@interfaces/delete-company-role.interface';
import { AssignRoleInterface } from '@interfaces/assign-role.interface';
import { RevokeRoleInterface } from '@interfaces/revoke-role.interface';

@Injectable()
export class CompanyRolesService {
  constructor() {}

  createCompanyRole({ companyId, payload, trx }: CreateCompanyRoleInterface) {}

  updateCompanyRole({ companyId, payload, trx }: UpdateCompanyRoleInterface) {}

  deleteCompanyRole({ companyId, payload, trx }: DeleteCompanyRoleInterface) {}

  assignRoleToUser({ companyId, payload, trx }: AssignRoleInterface) {}

  revokeUserRole({ companyId, payload, trx }: RevokeRoleInterface) {}
}
