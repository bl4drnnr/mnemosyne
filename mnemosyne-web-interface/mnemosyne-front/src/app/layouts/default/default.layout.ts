import { Component, Input } from '@angular/core';
import { DefaultTranslation } from '@layouts/default/default.translation';

@Component({
  selector: 'layout-default',
  templateUrl: './default.layout.html',
  styleUrls: ['./default.layout.scss'],
  providers: [DefaultTranslation]
})
export class DefaultLayout {
  @Input() showHeader = true;
  @Input() showHeaderBurger = true;

  @Input() showFooter = true;
  @Input() showSideBar = true;

  isSidebarOpen = false;
}
