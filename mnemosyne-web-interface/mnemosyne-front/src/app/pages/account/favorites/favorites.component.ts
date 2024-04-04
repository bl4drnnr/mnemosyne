import { Component, OnInit } from '@angular/core';
import { UserInfoResponse } from '@responses/user-info.interface';
import { RefreshTokensService } from '@services/refresh-tokens.service';
import { TranslationService } from '@services/translation.service';
import { Titles } from '@interfaces/titles.enum';

@Component({
  selector: 'page-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  userInfo: UserInfoResponse;

  constructor(
    private readonly refreshTokensService: RefreshTokensService,
    private readonly translationService: TranslationService
  ) {}

  getUserFavoritesProducts() {
    //
  }

  async ngOnInit() {
    this.translationService.setPageTitle(Titles.FAVORITES);

    const userInfoRequest = await this.refreshTokensService.refreshTokens();

    if (userInfoRequest) {
      userInfoRequest.subscribe({
        next: (userInfo) => (this.userInfo = userInfo)
      });
    }

    this.getUserFavoritesProducts();
  }
}
