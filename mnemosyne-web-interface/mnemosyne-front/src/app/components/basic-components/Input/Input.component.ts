import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './Input.component.html',
  styleUrls: ['./Input.component.scss']
})
export class InputComponent {
  @Input() label: string;
  @Input() type = 'text';
  value: string;
}
