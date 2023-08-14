import { ControllersEnum } from '@interfaces/controllers.enum';
import { MethodsEnum } from '@interfaces/methods.enum';
import { AuthEnum } from '@interfaces/auth.enum';
import { SecurityEnum } from '@interfaces/security.enum';
import { UsersEnum } from '@interfaces/users.enum';
import { RecoveryEnum } from '@interfaces/recovery.enum';
import { ConfirmationHashEnum } from '@interfaces/confirmation-hash.enum';
import { CompanyEnum } from '@interfaces/company.enum';

type EndpointsType =
  | AuthEnum
  | SecurityEnum
  | UsersEnum
  | RecoveryEnum
  | ConfirmationHashEnum
  | CompanyEnum;

export interface ProxyRequestInterface {
  controller: ControllersEnum;
  action: EndpointsType;
  method: MethodsEnum;
  payload?: object;
  params?: object;
  accessToken?: string;
}
