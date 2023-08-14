import { ActionControllerEnum } from '@interfaces/action-controller.enum';
import { MethodsEnum } from '@interfaces/methods.enum';
import { StatusesEnum } from '@interfaces/statuses.enum';

export interface LogActionInterface {
  logType: ActionControllerEnum;
  method?: MethodsEnum;
  controller?: string;
  endpoint?: string;
  message?: string;
  status: StatusesEnum;
  payload?: { body?: object; params?: object };
  error?: object;
}
