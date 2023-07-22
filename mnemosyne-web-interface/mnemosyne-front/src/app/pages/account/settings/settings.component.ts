import { Component } from '@angular/core';
import { UserInfoResponse } from '@responses/user-info.response';
import { RefreshTokensService } from '@services/refresh-tokens.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  userInfo: UserInfoResponse;

  constructor(private readonly refreshTokensService: RefreshTokensService) {}

  async ngOnInit() {
    this.userInfo = (await this.refreshTokensService.refreshTokens())!;
  }
}
