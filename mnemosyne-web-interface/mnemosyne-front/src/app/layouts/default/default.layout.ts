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
        { scope: 'credentials/registration', alias: 'reg' }
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
