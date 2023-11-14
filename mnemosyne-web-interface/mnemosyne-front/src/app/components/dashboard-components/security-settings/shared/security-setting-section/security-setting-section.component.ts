import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'security-setting-section',
  templateUrl: './security-setting-section.component.html',
  styleUrls: ['./security-setting-section.component.scss']
})
export class SecuritySettingSectionComponent {
  @Input() showSection: boolean;
  @Input() title: string;
  @Input() description: string;
  @Input() buttonLabel: string;
  @Input() dangerButton = false;
  @Input() disabledButton = false;
  @Input() emojiName: string;
  @Output() onButtonClick = new EventEmitter<void>();
}
