import { ActionController } from '@interfaces/action-controller.enum';
import { Method } from '@interfaces/methods.enum';
import { Status } from '@interfaces/statuses.enum';

export interface LogActionInterface {
  logType: ActionController;
  method?: Method;
  controller?: string;
  endpoint?: string;
  message?: string;
  status: Status;
  payload?: { body?: object; params?: object };
  error?: object;
}
