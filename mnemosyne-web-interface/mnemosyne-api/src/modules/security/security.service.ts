import * as node2fa from 'node-2fa';
import { Injectable } from '@nestjs/common';
import { ConfirmationHashService } from '@modules/confirmation-hash.service';
import { UsersService } from '@modules/users.service';
import { InjectModel } from '@nestjs/sequelize';
import { UserSettings } from '@models/user-settings.model';
import { VerifyTwoFaDto } from '@dto/verify-2fa.dto';
import { WrongCodeException } from '@exceptions/wrong-code.exception';
import { MfaSetDto } from '@dto/mfa-set.dto';
import { SendSmsCodeDto } from '@dto/send-sms-code.dto';
import { PhoneService } from '@shared/phone.service';
import { VerifyMobilePhoneDto } from '@dto/verify-mobile-phone.dto';

@Injectable()
export class SecurityService {
  constructor(
    private readonly confirmationHashService: ConfirmationHashService,
    private readonly userService: UsersService,
    private readonly phoneService: PhoneService,
    @InjectModel(UserSettings)
    private readonly userSettingsRepository: typeof UserSettings
  ) {}

  async generate2FaQrCode({ confirmationHash }: { confirmationHash: string }) {
    const { userId } =
      await this.confirmationHashService.getUserByConfirmationHash({
        confirmationHash
      });
    const user = await this.userService.getUserById(userId);

    const { qr, secret } = node2fa.generateSecret({
      name: 'Mnemosyne',
      account: user.email
    });

    await this.userSettingsRepository.update(
      {
        twoFaToken: secret
      },
      { where: { userId } }
    );

    return { qr };
  }

  async verifyTwoFaQrCode({
    payload,
    confirmationHash
  }: {
    payload: VerifyTwoFaDto;
    confirmationHash: string;
  }) {
    let userId: string;

    if (confirmationHash) {
      const userConfirmationHash =
        await this.confirmationHashService.getUserByConfirmationHash({
          confirmationHash
        });
      userId = userConfirmationHash.userId;
    }

    const { twoFaToken } = await this.userSettingsRepository.findOne({
      where: { userId }
    });

    const delta = node2fa.verifyToken(twoFaToken, payload.code);

    if (!delta || (delta && delta.delta !== 0)) throw new WrongCodeException();

    return new MfaSetDto();
  }

  async sendSmsCode({
    payload,
    confirmationHash
  }: {
    payload: SendSmsCodeDto;
    confirmationHash: string;
  }) {
    let userId: string;

    if (confirmationHash) {
      const userConfirmationHash =
        await this.confirmationHashService.getUserByConfirmationHash({
          confirmationHash
        });
      userId = userConfirmationHash.userId;
    }
  }

  async verifyMobilePhone({
    payload,
    confirmationHash
  }: {
    payload: VerifyMobilePhoneDto;
    confirmationHash: string;
  }) {
    //
  }
}
