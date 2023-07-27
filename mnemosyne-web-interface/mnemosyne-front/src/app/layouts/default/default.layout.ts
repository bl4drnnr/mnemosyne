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
        { scope: 'messages/errors', alias: 'errors' },
        { scope: 'messages/responses', alias: 'responses' },
        { scope: 'components/mfa', alias: 'mfa' },
        { scope: 'components/recovery-keys', alias: 'keys' },
        { scope: 'components/dropdown', alias: 'dropdown' },
        { scope: 'components/link', alias: 'link' },
        { scope: 'components/button', alias: 'button' },
        { scope: 'components/input', alias: 'input' },
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
