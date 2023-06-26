import { ACTION_CONTROLLER_TYPE } from '@interfaces/action-controller.type';
import { METHODS_TYPE } from '@interfaces/method.type';
import { STATUS_TYPE } from '@interfaces/status.type';

export interface LogActionInterface {
  logType: ACTION_CONTROLLER_TYPE;
  method?: METHODS_TYPE;
  controller?: string;
  endpoint?: string;
  message?: string;
  status: STATUS_TYPE;
  payload?: { body?: object; params?: object };
}
