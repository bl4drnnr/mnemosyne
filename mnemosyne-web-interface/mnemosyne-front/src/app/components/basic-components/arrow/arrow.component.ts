import { Component, Input } from '@angular/core';

@Component({
  selector: 'basic-arrow',
  templateUrl: './arrow.component.html',
  styleUrls: ['./arrow.component.scss']
})
export class ArrowComponent {
  @Input() isArrowOpen: boolean | undefined;
}
