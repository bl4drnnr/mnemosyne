import { Component, Input } from '@angular/core';

@Component({
  selector: 'layout-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultLayout {
  @Input() showHeader = true;
  @Input() showFooter = true;
  @Input() showSideBar = true;
}
