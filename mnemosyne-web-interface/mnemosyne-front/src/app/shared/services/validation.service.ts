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

  isPasswordCorrect(password: string) {
    if (password) {
      const regex = new RegExp(
        '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
      );
      return regex.test(password);
    } else {
      return null;
    }
  }

  isPasswordsSame({
    password,
    passwordRepeat
  }: {
    password: string;
    passwordRepeat: string;
  }) {
    return password === passwordRepeat;
  }

  checkPasswordLength(password: string) {
    if (password) return password.length >= 8;
    else return false;
  }

  checkPasswordsRules(password: string) {
    const passwordRules = [
      {
        error: false,
        text: 'Password length should be more than 8 characters'
      },
      {
        error: false,
        text: 'Password should contain at least one lowercase character'
      },
      {
        error: false,
        text: 'Password should contain at least one special character'
      },
      {
        error: false,
        text: 'Password should contain at least one digit character'
      },
      {
        error: false,
        text: 'Password should contain at least one uppercase character'
      }
    ];

    if (password) {
      if (password.length >= 8) {
        passwordRules[0].error = true;
      }
      if (/[a-z]/.test(password)) {
        passwordRules[1].error = true;
      }
      if (/[#?!@$%^&*-]/.test(password)) {
        passwordRules[2].error = true;
      }
      if (/\d/.test(password)) {
        passwordRules[3].error = true;
      }
      if (/[A-Z]/.test(password)) {
        passwordRules[4].error = true;
      }
    }
    return passwordRules;
  }
}
