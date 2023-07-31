import { CONFIRMATION_TYPE } from './confirmation-type.interface';

export interface VerificationEmailInterface {
  changingEmail?: string;
  email?: string;
  confirmationHash: string;
  confirmationType: CONFIRMATION_TYPE;
  userId: string;
}
