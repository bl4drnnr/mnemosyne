import { CONFIRMATION_TYPE } from './confirmation-type.interface';

export interface VerificationEmailInterface {
  changingEmail?: string;
  to?: string;
  confirmationHash: string;
  confirmationType: CONFIRMATION_TYPE;
  userId: string;
}
