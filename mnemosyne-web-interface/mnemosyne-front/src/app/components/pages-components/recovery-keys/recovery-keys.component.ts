import { saveAs } from 'file-saver';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RecoveryService } from '@services/recovery.service';
import { ValidationService } from '@services/validation.service';

@Component({
  selector: 'page-recovery-keys',
  templateUrl: './recovery-keys.component.html',
  styleUrls: [
    './recovery-keys.component.scss',
    '../../../pages/credentials/shared/credentials.component.scss'
  ]
})
export class RecoveryKeysComponent {
  @Input() hash: string;
  @Output() confirmRecoveryKeysSetup = new EventEmitter<void>();

  passphrase: string;
  recoveryKeysGenerated: boolean;
  recoveryKeys: Array<string>;

  constructor(
    private readonly validationService: ValidationService,
    private readonly recoveryService: RecoveryService
  ) {}

  isPassphraseValid() {
    return this.validationService.checkLength({
      str: this.passphrase,
      min: 8,
      max: 128
    });
  }

  keysCopied() {
    this.confirmRecoveryKeysSetup.emit();
  }

  downloadRecoveryKeys() {
    const recoveryKeysStr = this.recoveryKeys.join('\n\n');
    const fileName = 'Mnemosyne - Recovery Keys.txt';
    const blob = new Blob([recoveryKeysStr], { type: 'text/plain' });
    saveAs(blob, fileName);
  }

  generateRecoveryKeys() {
    if (!this.isPassphraseValid()) return;

    this.recoveryService
      .registrationGenerateRecoveryKeys({
        hash: this.hash,
        passphrase: this.passphrase
      })
      .subscribe({
        next: ({ recoveryKeys }) => {
          this.recoveryKeys = recoveryKeys;
          this.recoveryKeysGenerated = true;
        }
      });
  }
}
