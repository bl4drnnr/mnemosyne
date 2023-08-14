import { ErrorMessagesInterface } from '@interfaces/error-messages.interface';

export interface ErrorPayloadInterface {
  message?: string;
  messages?: Array<ErrorMessagesInterface>;
}
