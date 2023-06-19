import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfirmationHash } from '@models/confirmation-hash.model';
import { VerificationEmailInterface } from '@interfaces/verification-email.interface';
import { HashNotFoundException } from '@exceptions/hash-not-found.exception';
import { AccountAlreadyConfirmedException } from '@exceptions/account-already-confirmed.exception';
import { AccountConfirmedDto } from '@dto/account-confirmed.dto';
import { Transaction } from 'sequelize';
import { MfaNotSetDto } from '@dto/mfa-not-set.dto';
import { UsersService } from '@modules/users.service';

@Injectable()
export class ConfirmationHashService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    @InjectModel(ConfirmationHash)
    private readonly confirmationHashRepository: typeof ConfirmationHash
  ) {}

  async createConfirmationHash({
    payload,
    trx: transaction
  }: {
    payload: VerificationEmailInterface;
    trx?: Transaction;
  }) {
    await this.confirmationHashRepository.create(
      {
        userId: payload.userId,
        confirmationHash: payload.confirmationHash,
        confirmationType: payload.confirmationType,
        changingEmail: payload.email
      },
      { transaction }
    );
  }

  async getUserByConfirmationHash({
    confirmationHash,
    trx: transaction
  }: {
    confirmationHash: string;
    trx?: Transaction;
  }) {
    const foundHash = await this.confirmationHashRepository.findOne({
      where: { confirmationHash },
      transaction
    });

    if (!foundHash) throw new HashNotFoundException();

    return { userId: foundHash.userId };
  }

  async confirmAccount({
    confirmationHash,
    trx: transaction
  }: {
    confirmationHash: string;
    trx?: Transaction;
  }) {
    const foundHash = await this.confirmationHashRepository.findOne({
      where: { confirmationHash },
      transaction
    });

    if (!foundHash) throw new HashNotFoundException();

    const userSettings = await this.userService.getUserSettingsByUserId({
      userId: foundHash.userId,
      trx: transaction
    });

    if (foundHash.confirmed && (userSettings.phone || userSettings.twoFaToken))
      throw new AccountAlreadyConfirmedException();

    if (foundHash.confirmed && !userSettings.phone && !userSettings.twoFaToken)
      return new MfaNotSetDto();

    await this.confirmationHashRepository.update(
      {
        confirmed: true
      },
      { where: { id: foundHash.id }, transaction }
    );

    return new AccountConfirmedDto();
  }
}
