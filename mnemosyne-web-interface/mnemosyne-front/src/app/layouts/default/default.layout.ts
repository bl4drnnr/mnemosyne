import { Component, Input } from '@angular/core';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

@Component({
  selector: 'layout-default',
  templateUrl: './default.layout.html',
  styleUrls: ['./default.layout.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: [
        { scope: 'components/button', alias: 'button' },
        { scope: 'components/sidebar', alias: 'sidebar' },
        { scope: 'credentials/registration', alias: 'reg' },
        { scope: 'account/settings', alias: 'settings' }
      ]
    }
  ]
})
export class DefaultLayout {
  @Input() showHeader = true;
  @Input() showHeaderBurger = true;

  @Input() showFooter = true;
  @Input() showSideBar = true;

  isSidebarOpen = false;
}
