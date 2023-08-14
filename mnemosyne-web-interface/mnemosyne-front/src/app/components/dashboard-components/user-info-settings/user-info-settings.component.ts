import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserInfoInterface } from '@responses/user-info.interface';
import { ValidationService } from '@services/validation.service';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

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
  @Input() userInfo: UserInfoInterface;
  @Input() userId: string;
  @Input() firstName: string;
  @Input() lastName: string;
  @Input() email: string;
  @Input() isProfilePicPresent: boolean;
  @Output() saveUserInfoEvent = new EventEmitter<UserInfoInterface>();

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
      userId: this.userId,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      isProfilePicPresent: this.isProfilePicPresent
    });
  }
}
