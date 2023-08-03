import { ConfirmEmailChangePayload } from '@payloads/confirm-email-change.payload';

export interface ConfirmEmailChangeInterface {
  hash: string;
  payload: ConfirmEmailChangePayload;
}
