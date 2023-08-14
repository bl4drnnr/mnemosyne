import { Component, OnInit } from '@angular/core';
import { UserInfoResponse } from '@responses/user-info.response';
import { RefreshTokensService } from '@services/refresh-tokens.service';
import { UsersService } from '@services/users.service';
import { GlobalMessageService } from '@shared/global-message.service';
import { TranslocoService } from '@ngneat/transloco';
import { UserSecurityResponse } from '@responses/user-security.response';
import { PageTitleService } from '@services/page-title.service';
import { TitlesEnum } from '@interfaces/titles.enum';
import { SettingSectionType } from '@interfaces/setting-section.type';

@Component({
  selector: 'component-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  isProfilePicPresent: boolean;

  userInfo: UserInfoResponse;
  userSecurity: UserSecurityResponse;
  currentSection: SettingSectionType = 'personal';

  constructor(
    private readonly globalMessageService: GlobalMessageService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly pageTitleService: PageTitleService,
    private readonly translocoService: TranslocoService,
    private readonly usersService: UsersService
  ) {}

  saveUserInfo(userInfo: UserInfoResponse) {
    this.usersService.updateUserInfo(userInfo).subscribe({
      next: ({ message }) =>
        this.globalMessageService.handle({
          message: this.translocoService.translate(message, {}, 'responses'),
          isError: false
        }),
      error: () => this.refreshTokensService.handleLogout()
    });
  }

  setTwoFa() {
    this.globalMessageService.handle({
      message: this.translocoService.translate('mfa.mfaSetUp', {}, 'settings'),
      isError: false
    });
  }

  disableTwoFa() {
    this.globalMessageService.handle({
      message: this.translocoService.translate(
        'mfa.mfaDisabled',
        {},
        'settings'
      ),
      isError: false
    });
  }

  setPhone() {
    this.globalMessageService.handle({
      message: this.translocoService.translate(
        'phone.phoneSetUp',
        {},
        'settings'
      ),
      isError: false
    });
  }

  disableMobilePhone() {
    this.globalMessageService.handle({
      message: this.translocoService.translate(
        'phone.phoneDisabled',
        {},
        'settings'
      ),
      isError: false
    });
  }

  passwordChanged() {
    this.globalMessageService.handle({
      message: this.translocoService.translate(
        'password.passwordChanged',
        {},
        'settings'
      ),
      isError: false
    });
  }

  changeEmailSent() {
    this.globalMessageService.handle({
      message: this.translocoService.translate(
        'email.emailChangeSent',
        {},
        'settings'
      ),
      isError: false
    });
  }

  getUserSecuritySettings() {
    this.usersService.getUserSecuritySettings().subscribe({
      next: (userSecurity) => (this.userSecurity = userSecurity)
    });
  }

  async ngOnInit() {
    this.pageTitleService.setPageTitle(TitlesEnum.SETTINGS);

    const userInfoRequest = await this.refreshTokensService.refreshTokens();

    if (userInfoRequest)
      userInfoRequest.subscribe({
        next: (userInfo) => {
          this.userInfo = userInfo;
          this.userId = userInfo.userId;
          this.firstName = userInfo.firstName;
          this.lastName = userInfo.lastName;
          this.email = userInfo.email;
          this.isProfilePicPresent = userInfo.isProfilePicPresent;
        }
      });

    this.getUserSecuritySettings();
  }
}
