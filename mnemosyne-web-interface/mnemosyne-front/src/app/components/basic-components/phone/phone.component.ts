import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ValidationService } from '@services/validation.service';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'basic-phone',
  templateUrl: './phone.component.html'
})
export class PhoneComponent {
  @Input() phoneCodeSent: boolean;
  @Input() onWhite = false;
  @Output() sendSmsCode = new EventEmitter<string>();
  @Output() runningCountdown = new EventEmitter<boolean>();

  phone: string;
  isPhoneCorrect = true;
  resendMessage: string;
  time = 120;
  isCountdownRunning = false;

  constructor(
    private readonly validationService: ValidationService,
    private readonly translocoService: TranslocoService
  ) {}

  sendSms() {
    this.sendSmsCode.emit(this.phone);
    this.startCountdown();
  }

  isMobilePhoneCorrect(phone: string) {
    this.phone = phone;
    if (phone.length)
      this.isPhoneCorrect = this.validationService.checkPhoneFormat(phone);
  }

  private startCountdown() {
    this.isCountdownRunning = true;
    this.runningCountdown.emit(true);
    const countdownInterval = setInterval(() => {
      this.time -= 1;
      if (this.time <= 0) {
        clearInterval(countdownInterval);
        this.isCountdownRunning = false;
        this.runningCountdown.emit(false);
        this.time = 120;
      }
      this.resendMessage = this.translocoService.translate(
        'resendCodeIn',
        { time: this.time, s: this.time !== 1 ? 's' : '' },
        'components/input'
      );
    }, 1000);
  }
}
