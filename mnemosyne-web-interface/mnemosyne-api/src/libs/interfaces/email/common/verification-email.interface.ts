import { Confirmation } from '@interfaces/confirmation-type.enum';

export interface VerificationEmailInterface {
  changingEmail?: string;
  to: string;
  confirmationType: Confirmation;
  userId: string;
}
