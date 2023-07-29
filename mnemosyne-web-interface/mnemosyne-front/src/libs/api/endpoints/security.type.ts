export enum SECURITY_ENDPOINTS {
  REGISTRATION_GENERATE_2FA_QR = 'registration-generate-2fa-qr',
  LOGIN_GENERATE_2FA_QR = 'login-generate-2fa-qr',
  GENERATE_2FA_QR = 'generate-2fa-qr',
  VERIFY_2FA = 'verify-2fa',
  DISABLE_2FA = 'disable-2fa',
  REGISTRATION_VERIFY_2FA = 'registration-verify-2fa',
  LOGIN_VERIFY_2FA = 'login-verify-2fa',
  REGISTRATION_SEND_SMS_CODE = 'registration-send-sms-code',
  REGISTRATION_VERIFY_MOBILE_PHONE = 'registration-verify-mobile-phone',
  LOGIN_VERIFY_MOBILE_PHONE = 'login-verify-mobile-phone',
  LOGIN_SEND_SMS_CODE = 'login-send-sms-code',
  SEND_SMS_CODE = 'send-sms-code',
  VERIFY_MOBILE_PHONE = 'verify-mobile-phone',
  DISABLE_PHONE = 'disable-phone',
  CHANGE_PASSWORD = 'change-password',
  GET_SMS_CODE = 'get-sms-code'
}
