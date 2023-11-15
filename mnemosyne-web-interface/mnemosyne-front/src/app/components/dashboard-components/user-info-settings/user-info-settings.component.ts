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
  @Input() namePronunciation: string | null;
  @Input() homeAddress: string | null;
  @Input() homePhone: string | null;

  @Input() email: string;
  @Input() isProfilePicPresent: boolean;
  @Output() saveUserInfoEvent = new EventEmitter<UpdateUserInfoPayload>();
  @Output() getUserInfoEvent = new EventEmitter<void>();

  incorrectFirstName: boolean;
  incorrectLastName: boolean;
  incorrectCompanyName: boolean;
  incorrectLocationName: boolean;
  incorrectWebsite: boolean;

  constructor(public validationService: ValidationService) {}

  wasInfoChanged() {
    return (
      (this.firstName && this.firstName !== this.userInfo.firstName) ||
      (this.lastName && this.lastName !== this.userInfo.lastName)
    );
  }

  incorrectData() {
    return (
      this.incorrectFirstName ||
      this.incorrectLastName ||
      this.incorrectLocationName ||
      this.incorrectCompanyName ||
      this.incorrectWebsite
    );
  }

  saveUserInfo() {
    this.saveUserInfoEvent.emit({
      firstName: this.firstName,
      lastName: this.lastName,
      namePronunciation: this.namePronunciation,
      homeAddress: this.homeAddress,
      homePhone: this.homePhone
    });
    this.getUserInfoEvent.emit();
  }
}
