import {Role} from "@custom-types/role.type";
import {Transaction} from "sequelize";

export interface GrantRoleDto {
  userId: string;
  value: Role;
  trx?: Transaction;
}
