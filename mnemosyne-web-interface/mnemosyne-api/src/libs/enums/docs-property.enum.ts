export enum DocsProperty {
  EMAIL_DESC = 'Email address',
  EMAIL_EXAMPLE = 'joe@doe.com',
  PASSWORD_DESC = 'User password',
  PASSWORD_EXAMPLE = '78ui&*UI',
  PHONE_MFA_CODE_DESC = 'User phone code - MFA',
  AUTH_MFA_CODE_DESC = 'User authentication application code - MFA',
  MFA_CODE_EXAMPLE = '123123',
  ACCESS_TOKEN_DESC = 'Access JWT token',
  ACCESS_TOKEN_EXAMPLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJERUZBVUxUIl0sInVzZXJJZCI6IjU4NGE3MzYzLWYxMmYtNGYxMy04NmQ1LTgxZWEwNzI5Y2I1MSIsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE2OTMxMzc2MDYsImV4cCI6MTY5MzE0NDgwNn0.c29vRfkNAbYi1stsn5EsN0N7ruUKrzkZe7RZpUDwu0U',
  REFRESH_TOKEN_DESC = 'Refresh JWT token',
  REFRESH_TOKEN_EXAMPLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQwNjY5MzYxLTc3ODgtNGJlNC05ZWNkLTAxNjcyM2FjMWU2MyIsInR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNjkzMTM3NjA2LCJleHAiOjE2OTM3NDI0MDZ9.eLt3U9RFbh_iRy1MpH30VIyCSMp6mxEw1Yw9MLEsvGU',
  WRONG_CRED_DESC = 'Wrong credentials error message',
  WRONG_CRED_EXAMPLE = 'wrong-credentials',
  FULL_MFA_REQUIRED_DESC = 'Full MFA (token + phone) required response message',
  FULL_MFA_REQUIRED_EXAMPLE = 'full-mfa-required',
  PHONE_REQUIRED_DESC = 'Phone MFA required response message',
  PHONE_REQUIRED_EXAMPLE = 'phone-required',
  TOKEN_TWO_FA_REQUIRED_DESC = 'Token MFA required response message',
  TOKEN_TWO_FA_REQUIRED_EXAMPLE = 'token-two-fa-required',
  RECOVERY_KEYS_NOT_SET_DESC = 'Recovery keys not set response message',
  RECOVERY_KEYS_NOT_SET_EXAMPLE = 'recovery-keys-not-set',
  MFA_NOT_SET_DESC = 'MFA not set response message',
  MFA_NOT_SET_EXAMPLE = 'mfa-not-set',
  SMS_EXPIRED_DESC = 'SMS expired error message',
  SMS_EXPIRED_EXAMPLE = 'sms-expired',
  WRONG_CODE_DESC = 'Wrong code error message',
  WRONG_CODE_EXAMPLE = 'wrong-code',
  ACC_NOT_CONFIRMED_DESC = 'Account not confirmed error message',
  ACC_NOT_CONFIRMED_EXAMPLE = 'account-not-confirmed',
  FIRST_NAME_DESC = 'First name',
  FIRST_NAME_EXAMPLE = 'Joe',
  LAST_NAME_DESC = 'Last name',
  LAST_NAME_EXAMPLE = 'Doe',
  TAC_DESC = 'Terms & Conditions',
  TAC_EXAMPLE = 'true',
  LANGUAGE_DESC = 'One of 3 available languages',
  USER_ALREADY_EXISTS_DESC = 'User already exists error message',
  USER_ALREADY_EXISTS_EXAMPLE = 'user-already-exists',
  TAC_NOT_ACCEPTED_DESC = 'T&C not accepted error message',
  TAC_NOT_ACCEPTED_EXAMPLE = 'tac-not-accepted',
  USER_CREATED_DESC = 'User created response message',
  USER_CREATED_EXAMPLE = 'user-created',
  USER_LOGGED_OUT_DESC = 'User logged out response message',
  USER_LOGGED_OUT_EXAMPLE = 'user-logged-out',
  CORRUPTED_TOKEN_DESC = 'Corrupted token error message',
  CORRUPTED_TOKEN_EXAMPLE = 'corrupted-token',
  EXPIRED_TOKEN_DESC = 'Token expired error message',
  EXPIRED_TOKEN_EXAMPLE = 'token-expired',
  INVALID_TOKEN_DESC = 'Invalid token error message',
  INVALID_TOKEN_EXAMPLE = 'invalid-token',
  COMPANY_LOCATION_DESC = 'Company location',
  COMPANY_LOCATION_EXAMPLE = 'Cupertino, CA 95014',
  COMPANY_NAME_DESC = 'Company name',
  COMPANY_NAME_EXAMPLE = 'Apple Inc.',
  COMPANY_WEBSITE_DESC = 'Company website',
  COMPANY_WEBSITE_EXAMPLE = 'apple.com',
  COMPANY_MEMBERS_DESC = 'List of company members',
  COMPANY_MEMBER_EMAIL_EXAMPLE = 'tim.cook@icloud.com',
  ROLES_DESC = 'Available user members',
  COMPANY_CREATED_DESC = 'Company created response message ',
  COMPANY_CREATED_EXAMPLE = 'company-created',
  COMPANY_EXISTS_DESC = 'Company already exists error message',
  COMPANY_EXISTS_EXAMPLE = 'company-already-exists',
  PARSE_EXCEPTION_DESC = 'Parse exception',
  PARSE_EXCEPTION_EXAMPLE = 'parse-error',
  USER_INVITED_DESC = 'User invited response message',
  USER_INVITED_EXAMPLE = 'user-invited',
  ACC_CONFIRMED_DESC = 'Account confirmed response message',
  ACC_CONFIRMED_EXAMPLE = 'account-confirmed',
  COMPANY_CONFIRMED_DESC = 'Company account confirmed response message',
  COMPANY_CONFIRMED_EXAMPLE = 'company-account-confirmed',
  COMPANY_MEMBER_ACC_CONFIRMED_DESC = 'Company member account confirmed response message',
  COMPANY_MEMBER_ACC_CONFIRMED_EXAMPLE = 'company-member-acc-confirmed',
  EMAIL_CHANGED_DESC = 'Email changed response message',
  EMAIL_CHANGED_EXAMPLE = 'email-changed',
  PASSPHRASE_DESC = 'Passphrase',
  PASSPHRASE_EXAMPLE = '123123123',
  RECOVERY_KEYS_DESC = 'List of recovery keys',
  RECOVERY_KEYS_EXAMPLE = 'e54ee7e285fbb....',
  ACCOUNT_RECOVERED_DESC = 'Account recovered response message',
  ACCOUNT_RECOVERED_EXAMPLE = 'account-recovered',
  FULL_NAME_DESC = 'Full name',
  FILL_NAME_EXAMPLE = 'Joe Doe',
  PHONE_DESC = 'Phone',
  PHONE_EXAMPLE = '+48123123123',
  TWO_FA_TOKEN_DESC = '2FA token',
  TWO_FA_TOKEN_EXAMPLE = '7BEEKMUDHULQVZYE7LQYR2R4BDP5NJJA',
  ACCOUNT_DELETED_DESC = 'Account deleted response message',
  ACCOUNT_DELETED_EXAMPLE = 'account-deleted',
  DELETE_CONFIRMATION_REQUIRED_DESC = 'Delete confirmation required response message',
  DELETE_CONFIRMATION_REQUIRED_EXAMPLE = 'delete-confirmation-required',
  EMAIL_CHANGE_EMAIL_SENT_DESC = 'Email change email set response message',
  EMAIL_CHANGE_EMAIL_SENT_EXAMPLE = 'email-change-email-sent',
  MFA_DISABLED_DESC = 'MFA disabled response message',
  MFA_DISABLED_EXAMPLE = 'mfa-disabled',
  MFA_SET_DESC = 'MFA set response message',
  MFA_SET_EXAMPLE = 'mfa-set',
  PASSWORD_CHANGED_DESC = 'Password changed response message',
  PASSWORD_CHANGED_EXAMPLE = 'password-changed',
  PASSWORD_NOT_SET_DESC = 'Password not set response message',
  PASSWORD_NOT_SET_EXAMPLE = 'password-not-set',
  SMS_CLEARED_DESC = 'SMS cleared response message',
  SMS_CLEARED_EXAMPLE = 'sms-cleared',
  SMS_CODE_SENT_DESC = 'SMS code sent response message',
  SMS_CODE_SENT_EXAMPLE = 'sms-code-sent',
  USER_DATA_NOT_SET_DESC = 'User data not set response message',
  USER_DATA_NOT_SET_EXAMPLE = 'user-data-not-set',
  USER_PHOTO_DESC = 'User base64-encoded images',
  USER_PHOTO_EXAMPLE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4...',
  PASSWORD_RESET_DESC = 'Password reset response message',
  PASSWORD_RESET_EXAMPLE = 'password-reset',
  PHOTO_UPLOADED_DESC = 'Photo uploaded response message',
  PHOTO_UPLOADED_EXAMPLE = 'photo-uploaded',
  RESET_PASSWORD_EMAIL_SENT_DESC = 'Reset password email sent response message',
  RESET_PASSWORD_EMAIL_SENT_EXAMPLE = 'reset-password-email-sent',
  USER_UPDATED_DESC = 'User updated response message',
  USER_UPDATE_EXAMPLE = 'user-updated',
  COMPANY_UPDATED_DESC = 'Company update response message',
  COMPANY_UPDATED_EXAMPLE = 'company-updated',
  FORBIDDEN_RESOURCE_DESC = 'Forbidden resource error message',
  FORBIDDEN_RESOURCE_EXAMPLE = 'forbidden',
  ACC_ALREADY_CONFIRMED_DESC = 'Account already confirmed error message',
  ACC_ALREADY_CONFIRMED_EXAMPLE = 'account-already-confirmed',
  HASH_NOT_FOUND_DESC = 'Hash not found error message',
  HASH_NOT_FOUND_EXAMPLE = 'hash-not-found',
  WRONG_RECOVERY_KEYS_DESC = 'Wrong recovery keys error message',
  WRONG_RECOVERY_KEYS_EXAMPLE = 'wrong-recovery-keys',
  ROLES_DOESNT_EXIST_DESC = 'Roles does not exist error message',
  ROLES_DOESNT_EXIST_EXAMPLE = 'role-doesnt-exists',
  EMAIL_ALREADY_CHANGED_DESC = 'Email already changed error message',
  EMAIL_ALREADY_CHANGED_EXAMPLE = 'email-already-changed',
  EMAIL_ALREADY_TAKEN_DESC = 'Email already taken error message',
  EMAIL_ALREADY_TAKEN_EXAMPLE = 'email-already-taken',
  LINK_EXPIRED_DESC = 'Link expired error message',
  LINK_EXPIRED_EXAMPLE = 'link-expired',
  PASSWORD_ALREADY_CHANGED_DESC = 'Password already changed error message',
  PASSWORD_ALREADY_CHANGED_EXAMPLE = 'password-already-changed',
  PHONE_NOT_SET_UP_DESC = 'Phone not set up error message',
  PHONE_NOT_SET_UP_EXAMPLE = 'phone-not-set-up',
  TWO_FA_NOT_SET_UP_DESC = '2FA not set up error message',
  TWO_FA_NOT_SET_UP_EXAMPLE = 'two-fa-not-set-up',
  WRONG_DELETION_CONFIRMATION_DESC = 'Wrong deletion confirmation error message',
  WRONG_DELETION_CONFIRMATION_EXAMPLE = 'wrong-deletion-confirmation',
  WRONG_PROVIDED_PHONE_DESC = 'Wrong provided phone error message',
  WRONG_PROVIDED_PHONE_EXAMPLE = 'wrong-provided-phone',
  WRONG_TIMEFRAME_DESC = 'Wrong timeframe error message',
  WRONG_TIMEFRAME_EXAMPLE = 'wrong-timeframe',
  PREVIOUS_PASSWORD_DESC = 'Previous password error message',
  PREVIOUS_PASSWORD_EXAMPLE = 'previous-password',
  WRONG_PICTURE_FORMAT_DESC = 'Wrong picture format error message',
  WRONG_PICTURE_FORMAT_EXAMPLE = 'wrong-picture-format',
  USER_ID_DESC = 'Hashed (MD5) user ID',
  USER_ID_EXAMPLE = '7630e8093291151b656de0dd48a60017',
  IS_USER_PROFILE_PIC_DESC = 'Is user profile picture present',
  IS_USER_PROFILE_PIC_EXAMPLE = 'true',
  IS_TWO_FA_SET_UP_DESC = 'Is 2FA set up',
  IS_TWO_FA_SET_UP_EXAMPLE = 'true',
  IS_EMAIL_CHANGED_DESC = 'Is email changed',
  IS_EMAIL_CHANGED_EXAMPLE = 'true',
  PASSWORD_CAN_BE_CHANGED_DESC = 'Password can be changed',
  PASSWORD_CAN_BE_CHANGED_EXAMPLE = 'true',
  PHONE_STATUS_IS_SET_UP_DESC = 'Phone setup - is phone set up',
  PHONE_STATUS_IS_SET_UP_EXAMPLE = 'true',
  PHONE_STATUS_2_LAST_DIGITS_DESC = 'Phone setup - 2 last digits',
  PHONE_STATUS_2_LAST_DIGITS_EXAMPLE = '12',
  QR_CODE_LINK_DESC = 'Link that leads to QR code to scan (via Google API)',
  QR_CODE_LINK_EXAMPLE = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=otpauth://totp/Mnemosyne%3Amikhail.bahdashych%40gmail.com%3Fsecret=7BEEKMUDHULQVZYE7LQYR2R4BDP5NJJA%26issuer=Mnemosyne',
  PHONE_ALREADY_TAKEN_DESC = 'Phone already taken error message',
  PHONE_ALREADY_TAKEN_EXAMPLE = 'phone-already-taken',
  NAME_PRONUNS_DESC = 'This could be a phonetic pronunciation, or an example of something your name sounds like',
  NAME_PRONUNS_EXAMPLE = 'Zoe ("zo-ee")',
  HOME_ADDRESS_DESC = 'User home address',
  HOME_ADDRESS_EXAMPLE = 'One Apple Park Way, United States',
  HOME_PHONE_DESC = 'User home phone',
  HOME_PHONE_EXAMPLE = '(800) 1231-1234',
  COMPANY_USERS_DESC = 'List of company users (id and email)',
  COUNT_DESC = 'Count for the pagination',
  COUNT_EXAMPLE = '5',
  CONFIRMED_HASH_EXAMPLE = 'false',
  CONFIRMATION_HASH_CREATED_AT_EXAMPLE = '2023-11-17T11:42:26.534Z',
  IS_COMPANY_MEMBER_DESC = 'Flag if the user is company member',
  IS_COMPANY_MEMBER_EXAMPLE = 'false',
  ROLE_ID_EXAMPLE = '4eea51f7-ebf1-4470-b54e-eb3b8c79bf8c',
  ROLE_ID_VALUE = 'PRIMARY_ADMIN'
}
