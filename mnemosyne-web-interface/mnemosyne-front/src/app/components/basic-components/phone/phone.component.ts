import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ValidationService } from '@services/validation.service';
import { TranslationService } from '@services/translation.service';
import { ComponentsTranslation } from '@translations/components.enum';

@Component({
  selector: 'basic-phone',
  templateUrl: './phone.component.html'
})
export class PhoneComponent implements OnInit {
  @Input() phoneInput: string | null;
  @Input() readOnly = false;
  @Input() phoneCodeSent: boolean;
  @Input() onWhite = false;
  @Input() startCountdownManually = false;
  @Output() sendSmsCode = new EventEmitter<string | null>();
  @Output() runningCountdown = new EventEmitter<boolean>();

  phone: string;
  isPhoneCorrect = true;
  resendMessage: string;
  time = 120;
  isCountdownRunning = false;

  constructor(
    private readonly validationService: ValidationService,
    private readonly translationService: TranslationService
  ) {}

  sendSms() {
    this.sendSmsCode.emit(this.readOnly ? null : this.phone);
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
    const countdownInterval = setInterval(async () => {
      this.time -= 1;
      if (this.time <= 0) {
        clearInterval(countdownInterval);
        this.isCountdownRunning = false;
        this.runningCountdown.emit(false);
        this.time = 120;
      }
      this.resendMessage = await this.translationService.translateText(
        'resendCodeIn',
        ComponentsTranslation.INPUT,
        { time: this.time, s: this.time !== 1 ? 's' : '' }
      );
    }, 1000);
  }

  ngOnInit() {
    if (this.startCountdownManually) this.startCountdown();
  }
}
