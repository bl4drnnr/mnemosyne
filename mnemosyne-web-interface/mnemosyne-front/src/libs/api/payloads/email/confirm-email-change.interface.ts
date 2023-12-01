import { ConfirmEmailChangePayload } from '@payloads/confirm-email-change-payload.interface';

export interface ConfirmEmailChangeInterfacePayload {
  hash: string;
  payload: ConfirmEmailChangePayload;
}
