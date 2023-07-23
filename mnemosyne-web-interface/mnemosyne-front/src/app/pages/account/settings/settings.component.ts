import { Component } from '@angular/core';
import { UserInfoResponse } from '@responses/user-info.response';
import { RefreshTokensService } from '@services/refresh-tokens.service';
import { ValidationService } from '@services/validation.service';
import { UsersService } from '@services/users.service';
import { GlobalMessageService } from '@shared/global-message.service';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'component-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  userInfo: UserInfoResponse;
  currentSection: 'personal' | 'security' = 'personal';

  incorrectFirstName: boolean;
  incorrectLastName: boolean;
  incorrectCompanyName: boolean;
  incorrectLocationName: boolean;

  constructor(
    private readonly globalMessageService: GlobalMessageService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly translocoService: TranslocoService,
    private readonly usersService: UsersService,
    public validationService: ValidationService
  ) {}

  saveUserInfo() {
    const accessToken = localStorage.getItem('_at')!;
    this.usersService
      .updateUserInfo({
        accessToken,
        payload: this.userInfo
      })
      .subscribe({
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
  }
}
