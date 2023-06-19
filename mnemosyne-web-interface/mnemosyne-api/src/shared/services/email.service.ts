import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '@shared/config.service';
import * as SendGrid from '@sendgrid/mail';
import { ConfirmationHashService } from '@modules/confirmation-hash/confirmation-hash.service';
import { VerificationEmailInterface } from '@interfaces/verification-email.interface';
import { CONFIRMATION_TYPE } from '@interfaces/confirmation-type.interface';
import { Transaction } from 'sequelize';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ApiConfigService,
    private readonly confirmationHashService: ConfirmationHashService
  ) {
    SendGrid.setApiKey(this.configService.sendGridCredentials.api_key);
  }

  async sendEmail({
    target,
    confirmationHash,
    confirmationType
  }: {
    target: string;
    confirmationHash: string;
    confirmationType: CONFIRMATION_TYPE;
  }) {
    let mail: {
      to: string;
      subject: string;
      from: string;
      html: string;
    } = {
      to: target,
      from: this.configService.sendGridCredentials.sender_email,
      subject: '',
      html: ''
    };

    if (confirmationType === 'REGISTRATION') {
      const confirmationLink = `${this.configService.frontEndUrl}/account-confirmation/${confirmationHash}`;

      mail = {
        ...mail,
        subject: 'Mnemosyne - Registration confirmation',
        html: `
          <h1>Welcome!</h1>
          <br>
          <p>Click <a href="${confirmationLink}">here</a> in order to confirm registration.</p>
          <br>
          <p>If link doesn't work, copy this and paste in browser.</p>
          <p>${confirmationLink}</p>
        `
      };
    } else if (confirmationType === 'EMAIL_CHANGE') {
      const confirmationLink = `${this.configService.frontEndUrl}/email-change-confirmation/${confirmationHash}`;

      mail = {
        ...mail,
        subject: 'Mnemosyne - Email change confirmation',
        html: `
          <h1>Hello, hope you are doing well!</h1>
          <br>
          <p>Click <a href="${confirmationLink}">here</a> in order to confirm email change.</p>
          <br>
          <p>If link doesn't work, copy this and paste in browser.</p>
          <p>${confirmationLink}</p>
        `
      };
    } else if (confirmationType === 'FORGOT_PASSWORD') {
      mail = {
        ...mail,
        subject: 'Mnemosyne - Password reset',
        html: `
          <h1>Hello, hope you are doing well!</h1>
          <br>
          <p>Copy and paste this verification hash in order to change your password</p>
          <p>Confirmation string: <b>${confirmationHash}</b></p>
        `
      };
    }

    return await SendGrid.send(mail);
  }

  async sendVerificationEmail({
    payload,
    trx: transaction
  }: {
    payload: VerificationEmailInterface;
    trx?: Transaction;
  }) {
    const emailSettings = {
      email: ['EMAIL_CHANGE', 'FORGOT_PASSWORD'].includes(
        payload.confirmationType
      )
        ? payload.email
        : null,
      confirmationHash: payload.confirmationHash,
      confirmationType: payload.confirmationType as
        | 'EMAIL_CHANGE'
        | 'REGISTRATION'
        | 'FORGOT_PASSWORD'
    };

    await this.confirmationHashService.createConfirmationHash({
      payload: {
        userId: payload.userId,
        ...emailSettings
      },
      trx: transaction
    });

    await this.sendEmail({
      target: payload.email,
      ...emailSettings
    });
  }
}
