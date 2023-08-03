import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '@shared/config.service';
import * as SendGrid from '@sendgrid/mail';
import { ConfirmationHashService } from '@modules/confirmation-hash/confirmation-hash.service';
import { VerificationEmailInterface } from '@interfaces/verification-email.interface';
import { Transaction } from 'sequelize';
import { EmailTemplatesService } from '@shared/email-templates.service';
import { UserInfoInterface } from '@interfaces/user-info.interface';
import { LANGUAGE_TYPES } from '@interfaces/language.types';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ApiConfigService,
    private readonly emailTemplatesService: EmailTemplatesService,
    private readonly confirmationHashService: ConfirmationHashService
  ) {
    SendGrid.setApiKey(this.configService.sendGridCredentials.api_key);
  }

  async sendRegistrationConfirmationEmail({
    payload,
    userInfo,
    language,
    trx: transaction
  }: {
    payload: VerificationEmailInterface;
    userInfo: UserInfoInterface;
    language?: LANGUAGE_TYPES;
    trx?: Transaction;
  }) {
    const { confirmationHash, confirmationType, userId, to } = payload;

    const emailSettings: VerificationEmailInterface = {
      confirmationHash,
      confirmationType,
      userId
    };

    await this.createConfirmationHash({ emailSettings, trx: transaction });

    const link = `${this.configService.frontEndUrl}/account-confirmation/${confirmationHash}`;

    const { html, subject } =
      this.emailTemplatesService.registrationEmailTemplate({
        userInfo,
        link,
        language
      });

    await this.sendEmail({
      to,
      html,
      subject
    });
  }

  async sendRegistrationCompleteEmail({
    to,
    userInfo,
    language
  }: {
    to: string;
    userInfo: UserInfoInterface;
    language?: LANGUAGE_TYPES;
  }) {
    const link = `${this.configService.frontEndUrl}/login`;

    const { html, subject } = this.emailTemplatesService.registrationComplete({
      userInfo,
      link,
      language
    });

    await this.sendEmail({
      to,
      html,
      subject
    });
  }

  async sendForgotPasswordEmail({
    payload,
    userInfo,
    language,
    trx: transaction
  }: {
    payload: VerificationEmailInterface;
    userInfo: UserInfoInterface;
    language?: LANGUAGE_TYPES;
    trx?: Transaction;
  }) {
    const { confirmationHash, confirmationType, userId, to } = payload;

    const emailSettings: VerificationEmailInterface = {
      confirmationHash,
      confirmationType,
      userId
    };

    await this.createConfirmationHash({ emailSettings, trx: transaction });

    const link = `${this.configService.frontEndUrl}/reset-password/${confirmationHash}`;

    const { html, subject } =
      this.emailTemplatesService.forgotPasswordEmailTemplate({
        userInfo,
        link,
        language
      });

    await this.sendEmail({
      to,
      html,
      subject
    });
  }

  async sendResetPasswordCompleteEmail({
    to,
    userInfo,
    language
  }: {
    to: string;
    userInfo: UserInfoInterface;
    language?: LANGUAGE_TYPES;
  }) {
    const link = `${this.configService.frontEndUrl}/login`;

    const { html, subject } = this.emailTemplatesService.resetPasswordComplete({
      userInfo,
      link,
      language
    });

    await this.sendEmail({
      to,
      html,
      subject
    });
  }

  async sendEmailChangeEmail({
    payload,
    userInfo,
    language,
    trx: transaction
  }: {
    payload: VerificationEmailInterface;
    userInfo: UserInfoInterface;
    language?: LANGUAGE_TYPES;
    trx?: Transaction;
  }) {
    const { confirmationHash, confirmationType, userId, to, changingEmail } =
      payload;

    const emailSettings: VerificationEmailInterface = {
      changingEmail,
      confirmationHash,
      confirmationType,
      userId
    };

    await this.createConfirmationHash({ emailSettings, trx: transaction });

    const link = `${this.configService.frontEndUrl}/email-change-confirmation/${payload.confirmationHash}`;

    const { html, subject } =
      this.emailTemplatesService.emailChangeEmailTemplate({
        userInfo,
        link,
        language
      });

    await this.sendEmail({
      to,
      html,
      subject
    });
  }

  async sendEmailChangeCompleteEmail({
    to,
    userInfo,
    language
  }: {
    to: string;
    userInfo: UserInfoInterface;
    language?: LANGUAGE_TYPES;
  }) {
    const link = `${this.configService.frontEndUrl}/login`;

    const { html, subject } = this.emailTemplatesService.emailChangeComplete({
      userInfo,
      link,
      language
    });

    await this.sendEmail({
      to,
      html,
      subject
    });
  }

  private async sendEmail({
    to,
    subject,
    html
  }: {
    to: string;
    subject: string;
    html: string;
  }) {
    return await SendGrid.send({
      from: this.configService.sendGridCredentials.sender_email,
      to,
      subject,
      html
    });
  }

  private async createConfirmationHash({
    emailSettings,
    trx
  }: {
    emailSettings: VerificationEmailInterface;
    trx?: Transaction;
  }) {
    await this.confirmationHashService.createConfirmationHash({
      payload: { ...emailSettings },
      trx
    });
  }
}
