import { Component, Input } from '@angular/core';
import { UserSecurityResponse } from '@responses/user-security.response';

@Component({
  selector: 'dashboard-security-settings',
  templateUrl: './security-settings.component.html',
  styleUrls: ['./security-settings.component.scss']
})
export class SecuritySettingsComponent {
  @Input() userSecurity: UserSecurityResponse;

  set2faModal: boolean;
  disable2faModal: boolean;
  setMobilePhoneModal: boolean;
  disableMobilePhoneModal: boolean;
  changeEmailModal: boolean;
  changePasswordModal: boolean;
  deleteAccountModal: boolean;
}
