import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfirmationHash } from '@models/confirmation-hash.model';
import { VerificationEmailInterface } from '@interfaces/verification-email.interface';
import { HashNotFoundException } from '@exceptions/hash-not-found.exception';
import { EmailAlreadyConfirmedException } from '@exceptions/email-already-confirmed.exception';
import { AccountConfirmedDto } from '@dto/account-confirmed.dto';

@Injectable()
export class ConfirmationHashService {
  constructor(
    @InjectModel(ConfirmationHash)
    private readonly confirmationHashRepository: typeof ConfirmationHash
  ) {}

  async createConfirmationHash({
    userId,
    confirmationHash,
    confirmationType,
    email
  }: VerificationEmailInterface) {
    await this.confirmationHashRepository.create({
      userId,
      confirmationHash,
      confirmationType,
      changingEmail: email
    });
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
    if (foundHash.confirmed) throw new EmailAlreadyConfirmedException();

    await this.confirmationHashRepository.update(
      {
        confirmed: true
      },
      { where: { id: foundHash.id } }
    );

    return new AccountConfirmedDto();
  }
}
