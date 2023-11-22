import { Component, OnInit } from '@angular/core';
import { UserInfoResponse } from '@responses/user-info.interface';
import { RefreshTokensService } from '@services/refresh-tokens.service';
import { UsersService } from '@services/users.service';
import { GlobalMessageService } from '@shared/global-message.service';
import { UserSecurityResponse } from '@responses/user-security.interface';
import { TranslationService } from '@services/translation.service';
import { Titles } from '@interfaces/titles.enum';
import { SettingSectionType } from '@interfaces/setting-section.type';
import { AccountTranslation } from '@translations/account.enum';
import { MessagesTranslation } from '@translations/messages.enum';
import { Router } from '@angular/router';
import { UpdateUserInfoPayload } from '@payloads/update-user-info.interface';

@Component({
  selector: 'component-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  userId: string;
  firstName: string;
  lastName: string;
  namePronunciation: string;
  homeAddress: string;
  homePhone: string;
  email: string;
  isProfilePicPresent: boolean;

  userInfo: UserInfoResponse;
  userSecurity: UserSecurityResponse;
  currentSection: SettingSectionType = 'company';

  constructor(
    private readonly globalMessageService: GlobalMessageService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly translationService: TranslationService,
    private readonly usersService: UsersService,
    private readonly router: Router
  ) {}

  saveUserInfo(userInfo: UpdateUserInfoPayload) {
    this.usersService.updateUserInfo(userInfo).subscribe({
      next: async ({ message }) => {
        const globalMessage = await this.translationService.translateText(
          message,
          MessagesTranslation.RESPONSES
        );
        this.globalMessageService.handle({
          message: globalMessage
        });
      },
      error: () => this.refreshTokensService.handleLogout()
    });
  }

  async setTwoFa() {
    const message = await this.translationService.translateText(
      'mfa.mfaSetUp',
      AccountTranslation.SETTINGS
    );
    this.globalMessageService.handle({ message });
  }

  async disableTwoFa() {
    const message = await this.translationService.translateText(
      'mfa.mfaDisabled',
      AccountTranslation.SETTINGS
    );
    this.globalMessageService.handle({ message });
  }

  async setPhone() {
    const message = await this.translationService.translateText(
      'phone.phoneSetUp',
      AccountTranslation.SETTINGS
    );
    this.globalMessageService.handle({ message });
  }

  async disableMobilePhone() {
    const message = await this.translationService.translateText(
      'phone.phoneDisabled',
      AccountTranslation.SETTINGS
    );
    this.globalMessageService.handle({ message });
  }

  async passwordChanged() {
    const message = await this.translationService.translateText(
      'password.passwordChanged',
      AccountTranslation.SETTINGS
    );
    this.globalMessageService.handle({ message });
  }

  async changeEmailSent() {
    const message = await this.translationService.translateText(
      'email.emailChangeSent',
      AccountTranslation.SETTINGS
    );
    this.globalMessageService.handle({ message });
  }

  getUserSecuritySettings() {
    this.usersService.getUserSecuritySettings().subscribe({
      next: (userSecurity) => (this.userSecurity = userSecurity)
    });
  }

  async accountDeleted() {
    localStorage.removeItem('_at');
    await this.handleRedirect('');
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  async requestUserInfo() {
    const userInfoRequest = await this.refreshTokensService.refreshTokens();

    if (userInfoRequest) {
      userInfoRequest.subscribe({
        next: (userInfo) => {
          this.userInfo = userInfo;
          this.userId = userInfo.userId;
          this.firstName = userInfo.firstName;
          this.lastName = userInfo.lastName;
          this.namePronunciation = userInfo.namePronunciation;
          this.homeAddress = userInfo.homeAddress;
          this.homePhone = userInfo.homePhone;
          this.email = userInfo.email;
          this.isProfilePicPresent = userInfo.isProfilePicPresent;
        }
      });
    }

    this.getUserSecuritySettings();
  }

  async ngOnInit() {
    this.translationService.setPageTitle(Titles.SETTINGS);
    await this.requestUserInfo();
  }
}
