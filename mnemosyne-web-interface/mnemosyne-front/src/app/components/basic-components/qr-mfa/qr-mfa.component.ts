import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'basic-qr-mfa',
  templateUrl: './qr-mfa.component.html',
  styleUrls: ['./qr-mfa.component.scss']
})
export class QrMfaComponent {
  @Input() qrCode: string;
  @Input() twoFaToken: string;
  @Input() showQr: boolean;
  @Input() onWhite = false;
  @Output() code = new EventEmitter<string>();
}
