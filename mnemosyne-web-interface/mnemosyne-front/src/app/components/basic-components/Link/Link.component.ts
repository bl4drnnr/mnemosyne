import { Component, Input } from '@angular/core';

@Component({
  selector: 'basic-link',
  templateUrl: './Link.component.html',
  styleUrls: ['./Link.component.scss']
})
export class LinkComponent {
  @Input() label: string;
  @Input() href: string;
}
