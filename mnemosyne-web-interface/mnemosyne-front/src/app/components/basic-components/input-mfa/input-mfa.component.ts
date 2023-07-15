import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'basic-input-mfa',
  templateUrl: './input-mfa.component.html',
  styleUrls: ['./input-mfa.component.scss']
})
export class InputMfaComponent implements OnInit {
  @ViewChild('input0') input0: ElementRef;
  @ViewChild('input1') input1: ElementRef;
  @ViewChild('input2') input2: ElementRef;
  @ViewChild('input3') input3: ElementRef;
  @ViewChild('input4') input4: ElementRef;
  @ViewChild('input5') input5: ElementRef;
  @Input() isPhone = false;

  @Output() mfaCode = new EventEmitter<string>();
  @Output() resendSms = new EventEmitter<void>();

  code = '';
  time = 120;
  resendMessage: string;
  isCountdownRunning = false;

  constructor(private readonly translocoService: TranslocoService) {}

  initResendSms() {
    this.resendSms.emit();
    this.startCountdown();
  }

  onInputChange(index: number, event: Event) {
    const inputValue = this.getInputValue(index);
    if (/^\d$/.test(inputValue)) {
      this.code += inputValue;
      this.mfaCode.emit(this.code);
      this.focusNextInput(index);
    } else if ((event as KeyboardEvent).key === 'Backspace') {
      this.code = this.code.slice(0, -1);
      this.mfaCode.emit(this.code);
      this.focusPreviousInput(index);
    }
  }

  private startCountdown() {
    this.isCountdownRunning = true;
    const countdownInterval = setInterval(() => {
      this.time -= 1;
      this.updateResendMessage(this.time);
      if (this.time <= 0) {
        clearInterval(countdownInterval);
        this.isCountdownRunning = false;
        this.resetTime();
      }
    }, 1000);
  }

  private updateResendMessage(time: number) {
    this.resendMessage = this.translocoService.translate(
      'resendCodeIn',
      { time, s: time !== 1 ? 's' : '' },
      'components/input'
    );
  }

  private resetTime() {
    this.time = 120;
  }

  private getInputValue(index: number): string {
    switch (index) {
      case 0:
        return this.input0.nativeElement.value;
      case 1:
        return this.input1.nativeElement.value;
      case 2:
        return this.input2.nativeElement.value;
      case 3:
        return this.input3.nativeElement.value;
      case 4:
        return this.input4.nativeElement.value;
      case 5:
        return this.input5.nativeElement.value;
      default:
        return '';
    }
  }

  private focusNextInput(index: number) {
    const nextIndex = index + 1;
    if (nextIndex <= 5) {
      const nextInput = this.getNextInput(nextIndex);
      nextInput?.focus();
    }
  }

  private focusPreviousInput(index: number) {
    const previousIndex = index - 1;
    if (previousIndex >= 0) {
      const previousInput = this.getPreviousInput(previousIndex);
      previousInput?.focus();
    }
  }

  private getNextInput(index: number): HTMLInputElement | null {
    switch (index) {
      case 1:
        return this.input1.nativeElement;
      case 2:
        return this.input2.nativeElement;
      case 3:
        return this.input3.nativeElement;
      case 4:
        return this.input4.nativeElement;
      case 5:
        return this.input5.nativeElement;
      default:
        return null;
    }
  }

  private getPreviousInput(index: number): HTMLInputElement | null {
    switch (index) {
      case 0:
        return this.input0.nativeElement;
      case 1:
        return this.input1.nativeElement;
      case 2:
        return this.input2.nativeElement;
      case 3:
        return this.input3.nativeElement;
      case 4:
        return this.input4.nativeElement;
      default:
        return null;
    }
  }

  ngOnInit() {
    if (this.isPhone) this.startCountdown();
  }
}
