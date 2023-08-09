import { CONTROLLERS } from '@interfaces/controllers.type';
import { ALLOWED_METHODS } from '@interfaces/methods.type';
import { AUTH_ENDPOINTS } from '@interfaces/auth.endpoints';
import { SECURITY_ENDPOINTS } from '@interfaces/security.endpoints';
import { USERS_ENDPOINTS } from '@interfaces/users.endpoints';
import { RECOVERY_ENDPOINTS } from '@interfaces/recovery.endpoints';
import { CONFIRMATION_ENDPOINTS } from '@interfaces/confirmation-hash.endpoints';
import { COMPANY_ENDPOINTS } from '@interfaces/company.endpoints';

type ENDPOINTS_TYPE =
  | AUTH_ENDPOINTS
  | SECURITY_ENDPOINTS
  | USERS_ENDPOINTS
  | RECOVERY_ENDPOINTS
  | CONFIRMATION_ENDPOINTS
  | COMPANY_ENDPOINTS;

export interface ProxyRequestInterface {
  controller: CONTROLLERS;
  action: ENDPOINTS_TYPE;
  method: ALLOWED_METHODS;
  payload?: object;
  params?: object;
  accessToken?: string;
}
