import { Component, Input } from '@angular/core';
import { EnvService } from '@shared/env.service';

@Component({
  selector: 'page-component-alt-registration',
  templateUrl: './alt-registration.component.html',
  styleUrls: ['./alt-registration.component.scss']
})
export class AltRegistrationComponent {
  @Input() block = false;
  @Input() continueWithTitle: string;

  constructor(private envService: EnvService) {}

  staticStorageLink = this.envService.getStaticStorageLink;
}
