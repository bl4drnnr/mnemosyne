import { Component } from '@angular/core';
import { UserInfoResponse } from '@responses/user-info.response';
import { RefreshTokensService } from '@services/refresh-tokens.service';
import { UsersService } from '@services/users.service';
import { GlobalMessageService } from '@shared/global-message.service';
import { TranslocoService } from '@ngneat/transloco';
import { UserSecurityResponse } from '@responses/user-security.response';

@Component({
  selector: 'component-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  userInfo: UserInfoResponse;
  userSecurity: UserSecurityResponse;
  currentSection: 'personal' | 'security' = 'personal';

  constructor(
    private readonly globalMessageService: GlobalMessageService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly translocoService: TranslocoService,
    private readonly usersService: UsersService
  ) {}

  saveUserInfo(userInfo: UserInfoResponse) {
    this.usersService.updateUserInfo({ payload: userInfo }).subscribe({
      next: ({ message }) =>
        this.globalMessageService.handle({
          message: this.translocoService.translate(message, {}, 'responses'),
          isError: false
        }),
      error: () => this.refreshTokensService.handleLogout()
    });
  }

  async ngOnInit() {
    const userInfoRequest = await this.refreshTokensService.refreshTokens();

    if (userInfoRequest)
      userInfoRequest.subscribe({
        next: (userInfo) => (this.userInfo = userInfo)
      });

    this.usersService.getUserSecuritySettings().subscribe({
      next: (userSecurity) => (this.userSecurity = userSecurity)
    });
  }
}
