import { CONFIRMATION_TYPE } from './confirmation-type.types';

export interface VerificationEmailInterface {
  changingEmail?: string;
  to?: string;
  confirmationHash: string;
  confirmationType: CONFIRMATION_TYPE;
  userId: string;
}