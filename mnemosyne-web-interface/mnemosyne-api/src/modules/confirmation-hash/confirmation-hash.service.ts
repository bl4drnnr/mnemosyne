import { Injectable } from '@nestjs/common';
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
    private readonly userService: UsersService,
    @InjectModel(ConfirmationHash)
    private readonly confirmationHashRepository: typeof ConfirmationHash
  ) {}

  async createConfirmationHash({
    payload,
    trx
  }: {
    payload: VerificationEmailInterface;
    trx: Transaction;
  }) {
    await this.confirmationHashRepository.create(
      {
        userId: payload.userId,
        confirmationHash: payload.confirmationHash,
        confirmationType: payload.confirmationType,
        changingEmail: payload.email
      },
      { transaction: trx }
    );
  }

  async getUserByConfirmationHash({
    confirmationHash
  }: {
    confirmationHash: string;
  }) {
    const foundHash = await this.confirmationHashRepository.findOne({
      where: { confirmationHash }
    });

    if (!foundHash) throw new HashNotFoundException();

    return { userId: foundHash.userId };
  }

  async confirmAccount({ confirmationHash }: { confirmationHash: string }) {
    const foundHash = await this.confirmationHashRepository.findOne({
      where: { confirmationHash }
    });

    if (!foundHash) throw new HashNotFoundException();

    const userSettings = await this.userService.getUserSettingsByUserId({
      userId: foundHash.userId
    });

    if (foundHash.confirmed && (userSettings.phone || userSettings.twoFaToken))
      throw new AccountAlreadyConfirmedException();

    if (foundHash.confirmed && !userSettings.phone && !userSettings.twoFaToken)
      return new MfaNotSetDto();

    await this.confirmationHashRepository.update(
      {
        confirmed: true
      },
      { where: { id: foundHash.id } }
    );

    return new AccountConfirmedDto();
  }
}
