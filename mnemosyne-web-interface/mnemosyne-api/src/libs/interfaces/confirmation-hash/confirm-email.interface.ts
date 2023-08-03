import { ConfirmEmailChangeDto } from '@dto/confirm-email-change.dto';
import { Transaction } from 'sequelize';

export interface ConfirmEmailInterface {
  confirmationHash: string;
  payload: ConfirmEmailChangeDto;
  trx?: Transaction;
}
