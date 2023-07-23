import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  constructor(private readonly translocoService: TranslocoService) {}

  isEmailCorrect(email: string) {
    if (email) {
      const regex = new RegExp(
        "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
      );
      return regex.test(email);
    } else return email === '';
  }

  mfaButtonDisable({
    isPhoneRequired,
    isMfaRequired,
    phoneCode,
    mfaCode
  }: {
    isPhoneRequired: boolean;
    isMfaRequired: boolean;
    phoneCode: string | undefined;
    mfaCode: string | undefined;
  }) {
    return (
      (isPhoneRequired && phoneCode?.length !== 6) ||
      (isMfaRequired && mfaCode?.length !== 6) ||
      (isPhoneRequired &&
        isMfaRequired &&
        phoneCode?.length !== 6 &&
        mfaCode?.length !== 6)
    );
  }

  checkPasswordsRules(password: string) {
    const passwordRules = [
      {
        error: true,
        text: this.translocoService.translate(
          'passwordRules.eightChars',
          {},
          'components/input'
        )
      },
      {
        error: true,
        text: this.translocoService.translate(
          'passwordRules.lower',
          {},
          'components/input'
        )
      },
      {
        error: true,
        text: this.translocoService.translate(
          'passwordRules.spec',
          {},
          'components/input'
        )
      },
      {
        error: true,
        text: this.translocoService.translate(
          'passwordRules.digit',
          {},
          'components/input'
        )
      },
      {
        error: true,
        text: this.translocoService.translate(
          'passwordRules.upper',
          {},
          'components/input'
        )
      }
    ];

    if (password) {
      if (password.length >= 8) {
        passwordRules[0].error = false;
      }
      if (/[a-z]/.test(password)) {
        passwordRules[1].error = false;
      }
      if (/[#?!@$%^&*-]/.test(password)) {
        passwordRules[2].error = false;
      }
      if (/\d/.test(password)) {
        passwordRules[3].error = false;
      }
      if (/[A-Z]/.test(password)) {
        passwordRules[4].error = false;
      }
    }
    return passwordRules;
  }

  isFQDN(domain: string) {
    if (domain) {
      const regex = new RegExp(
        /^(?!.*?_.*?)(?!(?:[\w]+?\.)?\-[\w\.\-]*?)(?![\w]+?\-\.(?:[\w\.\-]+?))(?=[\w])(?=[\w\.\-]*?\.+[\w\.\-]*?)(?![\w\.\-]{254})(?!(?:\.?[\w\-\.]*?[\w\-]{64,}\.)+?)[\w\.\-]+?(?<![\w\-\.]*?\.[\d]+?)(?<=[\w\-]{2,})(?<![\w\-]{25})$/
      );
      return regex.test(domain);
    } else return domain === '' || domain === undefined || domain === null;
  }

  checkLength({ str, min, max }: { str: string; min?: number; max?: number }) {
    if (!str) return true;

    const length = str.length;

    if (min !== undefined && max !== undefined) {
      return length >= min && length <= max;
    } else if (min !== undefined) {
      return length >= min;
    } else if (max !== undefined) {
      return length <= max;
    }

    return false;
  }
}
