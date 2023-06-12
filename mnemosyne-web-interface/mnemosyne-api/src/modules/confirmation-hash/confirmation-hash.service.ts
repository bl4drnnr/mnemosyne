import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfirmationHash } from '@models/confirmation-hash.model';
import { VerificationEmailInterface } from '@interfaces/verification-email.interface';

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
}
