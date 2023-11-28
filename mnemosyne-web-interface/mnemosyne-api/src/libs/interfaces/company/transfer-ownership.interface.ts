import { Transaction } from 'sequelize';
import { TransferOwnershipDto } from '@dto/transfer-ownership.dto';

export interface TransferOwnershipInterface {
  companyId: string;
  userId: string;
  payload: TransferOwnershipDto;
  trx?: Transaction;
}
