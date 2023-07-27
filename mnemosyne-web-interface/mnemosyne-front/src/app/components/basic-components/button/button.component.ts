import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoaderService } from '@shared/loader.service';

@Component({
  selector: 'basic-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() label: string;
  @Input() disabled = false;
  @Input() highHeight = false;
  @Input() fillButton = false;
  @Input() danger = false;
  @Input() fillDanger = false;
  @Input() onWhite = false;
  @Input() buttonDescription: string | null;

  @Output() buttonClick = new EventEmitter<void>();

  constructor(public loaderService: LoaderService) {}

  disableButton() {
    return this.disabled || this.loaderService.getStatus();
  }

  onClick() {
    if (this.disableButton()) return;

    this.buttonClick.emit();
  }
}
