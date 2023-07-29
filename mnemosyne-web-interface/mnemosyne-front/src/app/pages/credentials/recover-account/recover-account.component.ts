import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { RecoveryService } from '@services/recovery.service';
import { Router } from '@angular/router';
import { ValidationService } from '@services/validation.service';
import { GlobalMessageService } from '@shared/global-message.service';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'page-recover-account',
  templateUrl: './recover-account.component.html',
  styleUrls: ['../shared/credentials.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0s', style({ opacity: 0 })),
        animate('0.5s ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class RecoverAccountComponent {
  step = 1;
  passphrase: string;
  recoveryKey1: string;
  recoveryKey2: string;
  recoveryKey3: string;
  recoveryKey4: string;
  recoveryKey5: string;

  constructor(
    private readonly recoveryService: RecoveryService,
    private readonly translocoService: TranslocoService,
    private readonly validationService: ValidationService,
    private readonly globalMessageService: GlobalMessageService,
    private readonly router: Router
  ) {}

  recoverAccount() {
    this.recoveryService
      .recoverUserAccount({
        passphrase: this.passphrase,
        recoveryKeys: [
          this.recoveryKey1,
          this.recoveryKey2,
          this.recoveryKey3,
          this.recoveryKey4,
          this.recoveryKey5
        ]
      })
      .subscribe({
        next: () => (this.step = 2)
      });
  }

  selectFile(event: any): void {
    const file = event.target.files[0];

    const fileReader = new FileReader();

    fileReader.onload = () => {
      const recoveryKeysStr = fileReader.result;
      if (!recoveryKeysStr) return;

      const recoveryKeys = (recoveryKeysStr as string).split('\n\n');
      const areKeyValid =
        this.validationService.checkRecoveryKeys(recoveryKeys);

      if (!areKeyValid) {
        const errorMessage = this.translocoService.translate(
          'invalid-recovery-keys',
          {},
          'errors'
        );
        this.globalMessageService.handle({
          message: errorMessage,
          isError: true
        });
      } else {
        this.recoveryKey1 = recoveryKeys[0];
        this.recoveryKey2 = recoveryKeys[1];
        this.recoveryKey3 = recoveryKeys[2];
        this.recoveryKey4 = recoveryKeys[3];
        this.recoveryKey5 = recoveryKeys[4];
      }
    };

    fileReader.readAsText(file);
  }

  isPassphraseValid() {
    return this.validationService.checkLength({
      str: this.passphrase,
      min: 8,
      max: 128
    });
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }
}
