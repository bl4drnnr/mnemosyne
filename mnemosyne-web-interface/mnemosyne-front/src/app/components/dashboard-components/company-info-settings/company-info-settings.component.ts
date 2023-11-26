import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { GetCompanyInfoByIdInterface } from '@responses/get-company-by-id.interface';
import { ValidationService } from '@services/validation.service';

@Component({
  selector: 'dashboard-company-info-settings',
  templateUrl: './company-info-settings.component.html',
  styleUrls: ['./company-info-settings.component.scss'],
  animations: [
    trigger('infoChangedAnimation', [
      state('void', style({ transform: 'translateY(-5px)', opacity: 0 })),
      state('*', style({ transform: 'translateY(0)', opacity: 1 })),
      transition('void => *', animate('0.5s')),
      transition('* => void', animate('0.5s'))
    ])
  ]
})
export class CompanyInfoSettingsComponent {
  @Input() companyInformation: GetCompanyInfoByIdInterface;
  @Input() companyName: string;
  @Input() companyLocation: string;
  @Input() companyWebsite: string;
  @Input() companyOwnerEmail: string;
  @Output() saveCompanyInformationEvent = new EventEmitter<any>();

  incorrectCompanyName = true;
  incorrectLocationName = true;
  incorrectFQDN = true;

  constructor(public validationService: ValidationService) {}

  wasInfoChanged() {
    const wasCompanyNameChanged =
      this.companyName &&
      this.companyName !== this.companyInformation.companyName;
    const wasCompanyLocationChanged =
      this.companyLocation &&
      this.companyLocation !== this.companyInformation.companyLocation;
    const wasCompanyWebsiteChanged =
      this.companyWebsite &&
      this.companyWebsite !== this.companyInformation.companyWebsite;

    return (
      wasCompanyNameChanged ||
      wasCompanyLocationChanged ||
      wasCompanyWebsiteChanged
    );
  }

  incorrectData() {
    return (
      this.incorrectCompanyName ||
      this.incorrectLocationName ||
      this.incorrectFQDN
    );
  }

  saveCompanyInformation() {
    this.saveCompanyInformationEvent.emit();
  }
}
