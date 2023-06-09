import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
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

      error: true,
      text: 'Password length should be more than 8 characters'
  },
{
  error: true,
  text: 'Password should contain at least one lowercase character'
},
{
  error: true,
    text: 'Password should contain at least one special character'
},
{
  error: true,
    text: 'Password should contain at least one digit character'
},
{
  error: true,
    text: 'Password should contain at least one uppercase character'
}{
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
}
