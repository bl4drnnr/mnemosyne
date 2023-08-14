import { ConfirmEmailChangePayloadInterface } from '@payloads/confirm-email-change-payload.interface';

export interface ConfirmEmailChangeInterface {
  hash: string;
  payload: ConfirmEmailChangePayloadInterface;
}
