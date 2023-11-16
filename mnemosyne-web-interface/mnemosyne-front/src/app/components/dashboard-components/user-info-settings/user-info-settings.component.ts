import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserInfoResponse } from '@responses/user-info.interface';
import { ValidationService } from '@services/validation.service';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { UpdateUserInfoPayload } from '@payloads/update-user-info.interface';

@Component({
  selector: 'dashboard-user-info-settings',
  templateUrl: './user-info-settings.component.html',
  styleUrls: ['./user-info-settings.component.scss'],
  animations: [
    trigger('infoChangedAnimation', [
      state('void', style({ transform: 'translateY(-5px)', opacity: 0 })),
      state('*', style({ transform: 'translateY(0)', opacity: 1 })),
      transition('void => *', animate('0.5s')),
      transition('* => void', animate('0.5s'))
    ])
  ]
})
export class UserInfoSettingsComponent {
  @Input() userInfo: UserInfoResponse;
  @Input() userId: string;

  @Input() firstName: string;
  @Input() lastName: string;
  @Input() namePronunciation: string;
  @Input() homeAddress: string;
  @Input() homePhone: string;

  @Input() email: string;
  @Input() isProfilePicPresent: boolean;
  @Output() saveUserInfoEvent = new EventEmitter<UpdateUserInfoPayload>();
  @Output() getUserInfoEvent = new EventEmitter<void>();

  incorrectFirstName: boolean;
  incorrectLastName: boolean;

  constructor(public validationService: ValidationService) {}

  wasInfoChanged() {
    const wasFirstNameChanged =
      this.firstName && this.firstName !== this.userInfo.firstName;
    const wasLastNameChanged =
      this.lastName && this.lastName !== this.userInfo.lastName;
    const wasNamePronChanged =
      this.namePronunciation !== this.userInfo.namePronunciation;
    const wasHomeAddressChanged =
      this.homeAddress !== this.userInfo.homeAddress;
    const wasHomePhoneChanged = this.homePhone !== this.userInfo.homePhone;

    return (
      wasFirstNameChanged ||
      wasLastNameChanged ||
      wasNamePronChanged ||
      wasHomeAddressChanged ||
      wasHomePhoneChanged
    );
  }

  incorrectData() {
    return this.incorrectFirstName || this.incorrectLastName;
  }

  saveUserInfo() {
    const namePronunciation = this.namePronunciation
      ? this.namePronunciation
      : null;
    const homeAddress = this.homeAddress ? this.homeAddress : null;
    const homePhone = this.homePhone ? this.homePhone : null;

    this.saveUserInfoEvent.emit({
      firstName: this.firstName,
      lastName: this.lastName,
      namePronunciation,
      homeAddress,
      homePhone
    });

    this.getUserInfoEvent.emit();
  }
}
