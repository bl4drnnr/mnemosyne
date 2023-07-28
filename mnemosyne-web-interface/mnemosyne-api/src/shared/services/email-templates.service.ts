import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '@shared/config.service';
import { UserInfoInterface } from '@interfaces/user-info.interface';

@Injectable()
export class EmailTemplatesService {
  constructor(private readonly configService: ApiConfigService) {}

  registrationEmailTemplate({
    userInfo,
    confirmationLink
  }: {
    userInfo: UserInfoInterface;
    confirmationLink: string;
  }) {
    return '';
  }

  forgotPasswordEmailTemplate({
    userInfo,
    confirmationLink
  }: {
    userInfo: UserInfoInterface;
    confirmationLink: string;
  }) {
    return '';
  }

  emailChangeEmailTemplate({
    userInfo,
    confirmationLink
  }: {
    userInfo: UserInfoInterface;
    confirmationLink: string;
  }) {
    return '';
  }
}
