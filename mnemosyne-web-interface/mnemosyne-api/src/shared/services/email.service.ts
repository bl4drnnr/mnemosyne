import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '@shared/config.service';
import * as SendGrid from '@sendgrid/mail';
import { ConfirmationHashService } from '@modules/confirmation-hash/confirmation-hash.service';
import { VerificationEmailInterface } from '@interfaces/verification-email.interface';
import { EmailTemplatesService } from '@shared/email-templates.service';
import { SecurityInitEmailInterface } from '@interfaces/security-init-email.interface';
import { CompletedSecurityEmailInterface } from '@interfaces/completed-security-email.interface';
import { SendEmailInterface } from '@interfaces/send-email.interface';
import { EmailConfirmHashInterface } from '@interfaces/email-confirm-hash.interface';
import { GetConfirmLinkInterface } from '@interfaces/get-confirm-link.interface';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ApiConfigService,
    private readonly emailTemplatesService: EmailTemplatesService,
    private readonly confirmationHashService: ConfirmationHashService
  ) {
    SendGrid.setApiKey(this.configService.sendGridCredentials.apiKey);
  }

  async sendCompanyRegistrationEmail({
    payload,
    companyInfo,
    language,
    trx
  }: SecurityInitEmailInterface) {
    const { confirmationHash, confirmationType, userId, to } = payload;

    const emailSettings: VerificationEmailInterface = {
      confirmationHash,
      confirmationType,
      userId
    };

    await this.createConfirmationHash({ emailSettings, trx });

    const link = this.getConfirmationLink({
      hash: confirmationHash,
      route: 'company-account-confirmation'
    });

    const { html, subject } =
      this.emailTemplatesService.companyRegistrationEmailTemplate({
        companyInfo,
        link,
        language
      });

    await this.sendEmail({ to, html, subject });
  }

  async sendCompanyMemberEmail({
    companyInfo,
    payload,
    userInfo,
    language,
    trx
  }: SecurityInitEmailInterface) {
    const { confirmationHash, confirmationType, userId, to } = payload;

    const emailSettings: VerificationEmailInterface = {
      confirmationHash,
      confirmationType,
      userId
    };

    await this.createConfirmationHash({ emailSettings, trx });

    const link = this.getConfirmationLink({
      hash: confirmationHash,
      route: 'company-member-account-confirmation'
    });

    const { html, subject } =
      this.emailTemplatesService.companyMemberInviteEmailTemplate({
        companyInfo,
        userInfo,
        language,
        link
      });

    await this.sendEmail({ to, html, subject });
  }

  async sendRegistrationConfirmationEmail({
    payload,
    userInfo,
    language,
    trx
  }: SecurityInitEmailInterface) {
    const { confirmationHash, confirmationType, userId, to } = payload;

    const emailSettings: VerificationEmailInterface = {
      confirmationHash,
      confirmationType,
      userId
    };

    await this.createConfirmationHash({ emailSettings, trx });

    const link = this.getConfirmationLink({
      hash: confirmationHash,
      route: 'account-confirmation'
    });

    const { html, subject } =
      this.emailTemplatesService.registrationEmailTemplate({
        userInfo,
        link,
        language
      });

    await this.sendEmail({ to, html, subject });
  }

  async sendRegistrationCompleteEmail({
    to,
    userInfo,
    language
  }: CompletedSecurityEmailInterface) {
    const link = this.getConfirmationLink({ route: 'login' });

    const { html, subject } = this.emailTemplatesService.registrationComplete({
      userInfo,
      link,
      language
    });

    await this.sendEmail({ to, html, subject });
  }

  async sendCompanyRegistrationCompleteEmail({
    to,
    companyInfo,
    language
  }: CompletedSecurityEmailInterface) {
    const link = this.getConfirmationLink({ route: 'login' });

    const { html, subject } =
      this.emailTemplatesService.companyRegistrationComplete({
        companyInfo,
        link,
        language
      });

    await this.sendEmail({ to, html, subject });
  }

  async sendForgotPasswordEmail({
    payload,
    userInfo,
    language,
    trx
  }: SecurityInitEmailInterface) {
    const { confirmationHash, confirmationType, userId, to } = payload;

    const emailSettings: VerificationEmailInterface = {
      confirmationHash,
      confirmationType,
      userId
    };

    await this.createConfirmationHash({ emailSettings, trx });

    const link = this.getConfirmationLink({
      hash: confirmationHash,
      route: 'reset-password'
    });

    const { html, subject } =
      this.emailTemplatesService.forgotPasswordEmailTemplate({
        userInfo,
        link,
        language
      });

    await this.sendEmail({ to, html, subject });
  }

  async sendResetPasswordCompleteEmail({
    to,
    userInfo,
    language
  }: CompletedSecurityEmailInterface) {
    const link = this.getConfirmationLink({ route: 'login' });

    const { html, subject } = this.emailTemplatesService.resetPasswordComplete({
      userInfo,
      link,
      language
    });

    await this.sendEmail({ to, html, subject });
  }

  async sendEmailChangeEmail({
    payload,
    userInfo,
    language,
    trx
  }: SecurityInitEmailInterface) {
    const { confirmationHash, confirmationType, userId, to, changingEmail } =
      payload;

    const emailSettings: VerificationEmailInterface = {
      changingEmail,
      confirmationHash,
      confirmationType,
      userId
    };

    await this.createConfirmationHash({ emailSettings, trx });

    const link = this.getConfirmationLink({
      hash: payload.confirmationHash,
      route: 'email-change-confirmation'
    });

    const { html, subject } =
      this.emailTemplatesService.emailChangeEmailTemplate({
        userInfo,
        link,
        language
      });

    await this.sendEmail({ to, html, subject });
  }

  async sendEmailChangeCompleteEmail({
    to,
    userInfo,
    language
  }: CompletedSecurityEmailInterface) {
    const link = this.getConfirmationLink({ route: 'login' });

    const { html, subject } = this.emailTemplatesService.emailChangeComplete({
      userInfo,
      link,
      language
    });

    await this.sendEmail({ to, html, subject });
  }

  private getConfirmationLink({ hash, route }: GetConfirmLinkInterface) {
    return `${this.configService.frontEndUrl}/${route}${
      hash ? `/${hash}` : ''
    }`;
  }

  private async sendEmail({ to, subject, html }: SendEmailInterface) {
    const from = this.configService.sendGridCredentials.senderEmail;
    return await SendGrid.send({ from, to, subject, html });
  }

  private async createConfirmationHash({
    emailSettings,
    trx
  }: EmailConfirmHashInterface) {
    await this.confirmationHashService.createConfirmationHash({
      payload: { ...emailSettings },
      trx
    });
  }
}
