import { Controller } from '@interfaces/controller.enum';
import { Method } from '@interfaces/methods.enum';
import { AuthEndpoint } from '@interfaces/auth.enum';
import { SecurityEndpoint } from '@interfaces/security.enum';
import { UsersEndpoint } from '@interfaces/users.enum';
import { RecoveryEndpoint } from '@interfaces/recovery.enum';
import { ConfirmationHashEndpoint } from '@interfaces/confirmation-hash.enum';
import { CompanyEndpoint } from '@interfaces/company.enum';

type EndpointsType =
  | AuthEndpoint
  | SecurityEndpoint
  | UsersEndpoint
  | RecoveryEndpoint
  | ConfirmationHashEndpoint
  | CompanyEndpoint;

export interface ProxyRequestInterface {
  controller: Controller;
  action: EndpointsType;
  method: Method;
  payload?: object;
  params?: object;
  accessToken?: string;
}
