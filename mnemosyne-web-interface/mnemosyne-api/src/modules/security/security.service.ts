import * as node2fa from 'node-2fa';
import { Injectable } from '@nestjs/common';
import { ConfirmationHashService } from '@modules/confirmation-hash.service';
import { UsersService } from '@modules/users.service';
import { InjectModel } from '@nestjs/sequelize';
import { UserSettings } from '@models/user-settings.model';
import { VerifyTwoFaDto } from '@dto/verify-2fa.dto';
import { WrongCodeException } from '@exceptions/wrong-code.exception';
import { MfaSetDto } from '@dto/mfa-set.dto';

@Injectable()
export class SecurityService {
  constructor(
    private readonly confirmationHashService: ConfirmationHashService,
    private readonly userService: UsersService,
    @InjectModel(UserSettings)
    private readonly userSettingsRepository: typeof UserSettings
  ) {}

  async generate2FaQrCode({ confirmationHash }: { confirmationHash: string }) {
    // const { userId } =
    //   await this.confirmationHashService.getUserByConfirmationHash({
    //     confirmationHash
    //   });
    // const user = await this.userService.getUserById(userId);

    const { qr, secret } = node2fa.generateSecret({
      name: 'Mnemosyne',
      account: 'user.email'
    });

    // await this.userSettingsRepository.update(
    //   {
    //     twoFaToken: secret
    //   },
    //   { where: { userId } }
    // );

    return { qr };
  }

  async verifyTwoFaQrCode({
    payload,
    confirmationHash
  }: {
    payload: VerifyTwoFaDto;
    confirmationHash: string;
  }) {
    if (confirmationHash) {
      const { userId } =
        await this.confirmationHashService.getUserByConfirmationHash({
          confirmationHash
        });

      // const user = await this.userService.getUserById(userId);

      const { delta } = node2fa.verifyToken(payload.twoFaToken, payload.code);

      if (delta !== 0) throw new WrongCodeException();

      return new MfaSetDto();
    }
  }

  async sendSmsCode() {
    //
  }

  async verifyMobilePhone() {
    //
  }
}
