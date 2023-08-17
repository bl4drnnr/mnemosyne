import { Confirmation } from '@interfaces/confirmation-type.enum';

export interface VerificationEmailInterface {
  changingEmail?: string;
  to?: string;
  confirmationHash: string;
  confirmationType: Confirmation;
  userId: string;
}
