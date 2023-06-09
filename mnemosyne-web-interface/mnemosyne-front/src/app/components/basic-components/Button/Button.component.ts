import { Component, Input } from '@angular/core';

@Component({
  selector: 'basic-button',
  templateUrl: './Button.component.html',
  styleUrls: ['./Button.component.scss']
})
export class ButtonComponent {
  @Input() label: string;
  @Input() disabled = false;
  @Input() isLoading = false;
  @Input() showError = false;
  @Input() errorMessage: string;

  onClick() {
    // Handle button click event
  }
}
