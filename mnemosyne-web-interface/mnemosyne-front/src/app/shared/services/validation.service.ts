import { Injectable } from '@angular/core';
import { CheckLengthInterface } from '@interfaces/services/validation/check-length.interface';
import { MfaButtonDisableInterface } from '@interfaces/services/validation/mfa-button-disable.interface';
import { TranslationService } from '@services/translation.service';
import { ComponentsTranslation } from '@translations/components.enum';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  constructor(private readonly translationService: TranslationService) {}

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
  }: MfaButtonDisableInterface) {
    return (
      (isPhoneRequired && phoneCode?.length !== 6) ||
      (isMfaRequired && mfaCode?.length !== 6) ||
      (isPhoneRequired &&
        isMfaRequired &&
        phoneCode?.length !== 6 &&
        mfaCode?.length !== 6)
    );
  }

  async checkPasswordsRules(password: string) {
    const rules: {
      eightChars: string;
      lower: string;
      spec: string;
      digit: string;
      upper: string;
    } = await this.translationService.translateObject(
      'passwordRules',
      ComponentsTranslation.INPUT
    );

    const passwordRules = [
      { error: true, text: rules.eightChars },
      { error: true, text: rules.lower },
      { error: true, text: rules.spec },
      { error: true, text: rules.digit },
      { error: true, text: rules.upper }
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

  checkLength({ str, min, max }: CheckLengthInterface) {
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

  checkBase64PngImage(image: string) {
    if (image) {
      const regex = new RegExp(/data:image\/png;base64,([^\"]*)/);
      return regex.test(image);
    }
    return image === '';
  }

  checkPhoneFormat(phone: string) {
    if (phone) {
      const regex = new RegExp(/^(\+\d{1,3}[- ]?)?\d{10}$/);
      return regex.test(phone);
    }
    return phone === '';
  }

  checkRecoveryKeys(recoveryKeys: Array<string>) {
    let corruptedKey = false;

    if (recoveryKeys.length !== 5) return false;
    else recoveryKeys.forEach((key) => (corruptedKey = key.length !== 1024));

    return !corruptedKey;
  }
}
