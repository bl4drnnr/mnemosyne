import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserInfoResponse } from '@responses/user-info.response';
import { ValidationService } from '@services/validation.service';

@Component({
  selector: 'dashboard-user-info-settings',
  templateUrl: './user-info-settings.component.html',
  styleUrls: ['./user-info-settings.component.scss']
})
export class UserInfoSettingsComponent {
  @Input() userId: string;
  @Input() firstName: string;
  @Input() lastName: string;
  @Input() location: string;
  @Input() company: string;
  @Input() website: string;
  @Input() email: string;
  @Input() isProfilePicPresent: boolean;
  @Output() saveUserInfoEvent = new EventEmitter<UserInfoResponse>();

  incorrectFirstName: boolean;
  incorrectLastName: boolean;
  incorrectCompanyName: boolean;
  incorrectLocationName: boolean;

  constructor(public validationService: ValidationService) {}

  saveUserInfo() {
    this.saveUserInfoEvent.emit({
      userId: this.userId,
      firstName: this.firstName,
      lastName: this.lastName,
      location: this.location,
      company: this.company,
      website: this.website,
      email: this.email,
      isProfilePicPresent: this.isProfilePicPresent
    });
  }
}
