import { CONTROLLERS } from '@interfaces/controllers.type';
import { ALLOWED_METHODS } from '@interfaces/methods.type';
import { AUTH_ENDPOINTS } from '@interfaces/auth.type';
import { SECURITY_ENDPOINTS } from '@interfaces/security.type';
import { USERS_ENDPOINTS } from '@interfaces/users.type';
import { RECOVERY_ENDPOINTS } from '@interfaces/recovery';
import { CONFIRMATION_ENDPOINTS } from '@interfaces/confirmation-hash.type';

type ENDPOINTS_TYPE =
  | AUTH_ENDPOINTS
  | SECURITY_ENDPOINTS
  | USERS_ENDPOINTS
  | RECOVERY_ENDPOINTS
  | CONFIRMATION_ENDPOINTS;

export interface ProxyRequestInterface {
  controller: CONTROLLERS;
  action: ENDPOINTS_TYPE;
  method: ALLOWED_METHODS;
  payload?: object;
  params?: object;
  accessToken?: string;
}
