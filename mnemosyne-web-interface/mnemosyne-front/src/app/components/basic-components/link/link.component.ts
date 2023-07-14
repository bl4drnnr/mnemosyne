import { Component, Input } from '@angular/core';

@Component({
  selector: 'basic-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
export class LinkComponent {
  @Input() label: any;
  @Input() href: string;
  @Input() bold = false;
}
