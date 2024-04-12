<h1 align="center">
    MNEMOSYNE
</h1>

## How to run the project

### Requirements

- Node.js - v18.15.0
- Docker - Docker version 24.0.2, build cb74dfc
- Docker Compose - v2.18.1

### Steps

1. Go to [mnemosyne-api](mnemosyne-web-interface/mnemosyne-api) and run `npm i`
2. Go to [mnemosyne-api-proxy](mnemosyne-web-interface/mnemosyne-api-proxy) and run `npm i`
3. Go to [mnemosyne-front](mnemosyne-web-interface/mnemosyne-front) and run `npm i`
4. Put `.env.development` into [mnemosyne-web-interface](mnemosyne-web-interface)
5. From the root folder (**in 2 terminal windows**) run `npm run api:dev` and `npm run api:front`

### Environmental variables

```
NODE_ENV=development

API_PORT=3000
PROXY_PORT=4201

POSTGRES_PORT=5432
POSTGRES_HOST=mnemosyne-db
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=37apu7WqGsC4b7FBTf2Bm5bCqk3sDGqT
POSTGRES_DATABASE=mnemosyne

BASIC_AUTH_USERNAME=bxY7dDHsErnbs4VQQpYpPRE4Kj5txSUQ
BASIC_AUTH_PASSWORD=TejTug2NptVEj37873KQXHdGEmva5dkZ

SENDGRID_API_KEY=S
SENDGRID_SENDER_EMAIL=

FRONT_END_URL=http://localhost:4200

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_AUTH_PHONE=

AWS_SECRET_ACCESS_KEY=
AWS_ACCESS_KEY_ID=
AWS_S3_NAME=

JWT_SECRET=cU2K6ydfEcQXSdHNbDRJpLaCTXrRQnaH
JWT_ACCESS_EXPIRES_IN=120m
JWT_REFRESH_EXPIRES_IN=7d

HASH_PASSWORD_ROUNDS=10

ALLOWED_METHODS=POST,GET,PATCH,DELETE

ALLOWED_ENDPOINTS_AUTH=login,registration,logout,refresh,contact-us
ALLOWED_ENDPOINTS_HASH=account-confirmation,reset-user-password-confirmation,email-change-confirmation,company-account-confirmation,company-member-account-confirmation
ALLOWED_ENDPOINTS_RECOVERY=registration-generate-recovery-keys,login-generate-recovery-keys,generate-recovery-keys,recover-account
ALLOWED_ENDPOINTS_SECURITY=registration-generate-2fa-qr,login-generate-2fa-qr,generate-2fa-qr,registration-verify-2fa,login-verify-2fa,verify-2fa,disable-2fa,registration-send-sms-code,login-send-sms-code,send-sms-code,registration-verify-mobile-phone,login-verify-mobile-phone,verify-mobile-phone,disable-phone,delete-account,change-password,get-sms-code,change-email,hash-send-sms-code,clear-sms-code
ALLOWED_ENDPOINTS_USERS=forgot-password,upload-user-photo,user-info,user-security,user-info
ALLOWED_ENDPOINTS_COMPANY=create-company,company-information,delete-company,update-company,company-users,transfer-ownership
ALLOWED_ENDPOINTS_COMPANY_USERS=invite-user,company-member-info,delete-company-member,search-company-members
ALLOWED_ENDPOINTS_ROLES=create-role,update-role,get-company-roles

ALLOWED_CONTROLLERS=auth,security,confirmation-hash,users,recovery,company,company-users,roles

ORIGIN_API_URL=http://mnemosyne-api:3000/api

MONGO_LOGS_CLUSTER=mongodb+srv://

RECOVERY_ENCRYPTION_ITERATIONS=10000
RECOVERY_ENCRYPTION_KEY_SIZE=512
RECOVERY_ENCRYPTION_SALT=nhbgyf768t9YUIHBf897ouhn
RECOVERY_ENCRYPTION_IV=mHGFxENnZLbienLyANoi.e
```

