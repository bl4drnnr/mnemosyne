import { ConfirmEmailChangePayload } from '@payloads/confirm-email-change-payload.interface';

export interface ConfirmEmailChangeInterface {
  hash: string;
  payload: ConfirmEmailChangePayload;
}
