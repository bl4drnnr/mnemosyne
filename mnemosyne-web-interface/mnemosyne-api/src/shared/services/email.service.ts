import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '@shared/config.service';
import * as SendGrid from '@sendgrid/mail';
import { ConfirmationHashService } from '@modules/confirmation-hash/confirmation-hash.service';
import { EmailTemplatesService } from '@shared/email-templates.service';
import { SecurityInitEmailInterface } from '@interfaces/security-init-email.interface';
import { CompletedSecurityEmailInterface } from '@interfaces/completed-security-email.interface';
import { SendEmailInterface } from '@interfaces/send-email.interface';
import { EmailConfirmHashInterface } from '@interfaces/email-confirm-hash.interface';
import { GetConfirmLinkInterface } from '@interfaces/get-confirm-link.interface';
import { EmailSettingsInterface } from '@interfaces/email-settings.interface';
import { CryptographicService } from '@shared/cryptographic.service';
import { Confirmation } from '@interfaces/confirmation-type.enum';
import { Routes } from '@interfaces/routes.enum';
import { CompanyMemberDeletionInterface } from '@interfaces/company-member-deletion.interface';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ApiConfigService,
    private readonly cryptographicService: CryptographicService,
    private readonly emailTemplatesService: EmailTemplatesService,
    private readonly confirmationHashService: ConfirmationHashService
  ) {
    SendGrid.setApiKey(this.configService.sendGridCredentials.apiKey);
  }

  async sendCompanyRegistrationEmail({
    payload,
    isUserExists,
    companyInfo,
    language,
    trx
  }: SecurityInitEmailInterface) {
    const confirmationHash =
      this.cryptographicService.generateConfirmationHash();

    const { confirmationType, userId, to } = payload;

    const companyRegistration: EmailSettingsInterface = {
      confirmationHash,
      confirmationType,
      userId
    };

    await this.createConfirmationHash({
      emailSettings: companyRegistration,
      trx
    });

    if (!isUserExists) {
      const userRegistration: EmailSettingsInterface = {
        confirmationType: Confirmation.REGISTRATION,
        confirmationHash,
        userId
      };

      await this.createConfirmationHash({
        emailSettings: userRegistration,
        trx
      });
    }

    const link = this.getConfirmationLink({
      hash: confirmationHash,
      route: Routes.COMPANY_ACCOUNT_CONFIRMATION
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
    isUserExists,
    payload,
    userInfo,
    language,
    trx
  }: SecurityInitEmailInterface) {
    const confirmationHash =
      this.cryptographicService.generateConfirmationHash();

    const { confirmationType, userId, to } = payload;

    const memberInvitation: EmailSettingsInterface = {
      confirmationHash,
      confirmationType,
      userId
    };

    await this.createConfirmationHash({
      emailSettings: memberInvitation,
      trx
    });

    if (!isUserExists) {
      const memberRegistration: EmailSettingsInterface = {
        confirmationHash,
        confirmationType: Confirmation.REGISTRATION,
        userId
      };

      await this.createConfirmationHash({
        emailSettings: memberRegistration,
        trx
      });
    }

    const link = this.getConfirmationLink({
      hash: confirmationHash,
      route: Routes.COMPANY_MEMBER_ACCOUNT_CONFIRMATION
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
    const confirmationHash =
      this.cryptographicService.generateConfirmationHash();

    const { confirmationType, userId, to } = payload;

    const emailSettings: EmailSettingsInterface = {
      confirmationHash,
      confirmationType,
      userId
    };

    await this.createConfirmationHash({ emailSettings, trx });

    const link = this.getConfirmationLink({
      hash: confirmationHash,
      route: Routes.ACCOUNT_CONFIRMATION
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
    const link = this.getConfirmationLink({
      route: Routes.LOGIN
    });

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
    const link = this.getConfirmationLink({
      route: Routes.LOGIN
    });

    const { html, subject } =
      this.emailTemplatesService.companyRegistrationComplete({
        companyInfo,
        link,
        language
      });

    await this.sendEmail({ to, html, subject });
  }

  async sendCompanyMemberConfirmCompleteEmail({
    to,
    companyName,
    language
  }: CompletedSecurityEmailInterface) {
    const link = this.getConfirmationLink({
      route: Routes.LOGIN
    });

    const { html, subject } =
      this.emailTemplatesService.companyMemberConfirmCompleteEmail({
        link,
        companyName,
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
    const confirmationHash =
      this.cryptographicService.generateConfirmationHash();

    const { confirmationType, userId, to } = payload;

    const emailSettings: EmailSettingsInterface = {
      confirmationHash,
      confirmationType,
      userId
    };

    await this.createConfirmationHash({ emailSettings, trx });

    const link = this.getConfirmationLink({
      hash: confirmationHash,
      route: Routes.RESET_PASSWORD
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
    const link = this.getConfirmationLink({
      route: Routes.LOGIN
    });

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
    const confirmationHash =
      this.cryptographicService.generateConfirmationHash();

    const { confirmationType, userId, to, changingEmail } = payload;

    const emailSettings: EmailSettingsInterface = {
      changingEmail,
      confirmationHash,
      confirmationType,
      userId
    };

    await this.createConfirmationHash({ emailSettings, trx });

    const link = this.getConfirmationLink({
      hash: confirmationHash,
      route: Routes.EMAIL_CHANGE_CONFIRMATION
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
    const link = this.getConfirmationLink({
      route: Routes.LOGIN
    });

    const { html, subject } = this.emailTemplatesService.emailChangeComplete({
      userInfo,
      link,
      language
    });

    await this.sendEmail({ to, html, subject });
  }

  async sendDeletionCompanyMemberEmail({
    to,
    performedBy,
    companyName,
    language
  }: CompanyMemberDeletionInterface) {
    const { html, subject } = this.emailTemplatesService.userDeletedFromCompany(
      {
        language,
        companyName,
        performedBy
      }
    );

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
