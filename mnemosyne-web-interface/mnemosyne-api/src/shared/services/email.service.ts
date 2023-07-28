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
    language: LANGUAGE_TYPES | null;
    trx?: Transaction;
  }) {
    const emailSettings: VerificationEmailInterface = {
      email: null,
      confirmationHash: payload.confirmationHash,
      confirmationType: payload.confirmationType,
      userId: payload.userId
    };

    await this.createConfirmationHash({ emailSettings, trx: transaction });

    const confirmationLink = `${this.configService.frontEndUrl}/account-confirmation/${payload.confirmationHash}`;

    const { htmlPayload, subject } =
      this.emailTemplatesService.registrationEmailTemplate({
        userInfo,
        confirmationLink,
        language
      });

    await this.sendEmail({
      target: payload.email,
      emailHtml: htmlPayload,
      emailSubject: subject
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
    language: LANGUAGE_TYPES | null;
    trx?: Transaction;
  }) {
    const emailSettings = {
      email: payload.email,
      confirmationHash: payload.confirmationHash,
      confirmationType: payload.confirmationType,
      userId: payload.userId
    };

    await this.createConfirmationHash({ emailSettings, trx: transaction });

    const confirmationLink = `${this.configService.frontEndUrl}/reset-password/${payload.confirmationHash}`;

    const { htmlPayload, subject } =
      this.emailTemplatesService.forgotPasswordEmailTemplate({
        userInfo,
        confirmationLink,
        language
      });

    await this.sendEmail({
      target: payload.email,
      emailHtml: htmlPayload,
      emailSubject: subject
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
    language: LANGUAGE_TYPES | null;
    trx?: Transaction;
  }) {
    const emailSettings = {
      email: payload.email,
      confirmationHash: payload.confirmationHash,
      confirmationType: payload.confirmationType,
      userId: payload.userId
    };

    await this.createConfirmationHash({ emailSettings, trx: transaction });

    const confirmationLink = `${this.configService.frontEndUrl}/email-change-confirmation/${payload.confirmationHash}`;

    const { htmlPayload, subject } =
      this.emailTemplatesService.registrationEmailTemplate({
        userInfo,
        confirmationLink,
        language
      });

    await this.sendEmail({
      target: payload.email,
      emailHtml: htmlPayload,
      emailSubject: subject
    });
  }

  private async sendEmail({
    target,
    emailSubject,
    emailHtml
  }: {
    target: string;
    emailSubject: string;
    emailHtml: string;
  }) {
    return await SendGrid.send({
      to: target,
      from: this.configService.sendGridCredentials.sender_email,
      subject: emailSubject,
      html: emailHtml
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
