import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UserInfoResponse} from "@responses/user-info.response";
import {ValidationService} from "@services/validation.service";

@Component({
  selector: 'basic-user-info-settings',
  templateUrl: './user-info-settings.component.html',
  styleUrls: ['./user-info-settings.component.scss']
})
export class UserInfoSettingsComponent {
  @Input() userInfo: UserInfoResponse;
  @Output() saveUserInfoEvent = new EventEmitter<UserInfoResponse>();

  incorrectFirstName: boolean;
  incorrectLastName: boolean;
  incorrectCompanyName: boolean;
  incorrectLocationName: boolean;

  constructor(public validationService: ValidationService) {}

  saveUserInfo() {
    this.saveUserInfoEvent.emit(this.userInfo);
  }
}
