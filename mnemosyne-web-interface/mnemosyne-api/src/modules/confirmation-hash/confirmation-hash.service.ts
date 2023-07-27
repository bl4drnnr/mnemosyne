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
import { CONFIRMATION_TYPE } from '@interfaces/confirmation-type.interface';
import { RecoveryKeysNotSetDto } from '@dto/recovery-keys-not-set.dto';

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

  getConfirmationHash({
    confirmationHash,
    trx: transaction
  }: {
    confirmationHash: string;
    trx?: Transaction;
  }) {
    return this.confirmationHashRepository.findOne({
      where: { confirmationHash },
      transaction
    });
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

  async getUserConfirmationHashes({
    userId,
    hashType,
    getOne = false,
    getAll = false,
    orderBy = 'created_at',
    order = 'DESC'
  }: {
    userId: string;
    hashType?: CONFIRMATION_TYPE;
    getOne?: boolean;
    getAll?: boolean;
    orderBy?: string;
    order?: 'ASC' | 'DESC';
  }): Promise<ConfirmationHash | Array<ConfirmationHash>> {
    const where: Partial<ConfirmationHash> = { userId };

    if (hashType) where.confirmationHash = hashType;

    if (getOne) {
      return await this.confirmationHashRepository.findOne({
        where: { ...where },
        order: [[orderBy, order]]
      });
    }

    if (getAll) {
      return await this.confirmationHashRepository.findAll({
        where: { ...where },
        order: [[orderBy, order]]
      });
    }
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

    const user = await this.userService.getUserById({
      id: foundHash.userId,
      trx: transaction
    });

    const isAccConfirmed = foundHash.confirmed;
    const isMfaSet = user.isMfaSet;
    const isRecoverySetUp = user.userSettings.recoveryKeysFingerprint;

    if (isAccConfirmed && isMfaSet && isRecoverySetUp)
      throw new AccountAlreadyConfirmedException();

    if (isAccConfirmed && !isMfaSet) return new MfaNotSetDto();

    if (isAccConfirmed && !isRecoverySetUp) return new RecoveryKeysNotSetDto();

    await this.confirmationHashRepository.update(
      {
        confirmed: true
      },
      { where: { id: foundHash.id }, transaction }
    );

    return new AccountConfirmedDto();
  }
}
