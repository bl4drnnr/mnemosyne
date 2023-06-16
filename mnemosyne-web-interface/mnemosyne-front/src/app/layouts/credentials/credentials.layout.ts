import { Component, Input } from '@angular/core';
import { EnvService } from '@shared/env.service';
import { Router } from '@angular/router';

@Component({
  selector: 'layout-credentials',
  templateUrl: './credentials.layout.html',
  styleUrls: ['./credentials.layout.scss']
})
export class CredentialsLayout {
  @Input() renderSide: 'right' | 'left';
  @Input() picture: string;
  @Input() mirroredHeader: boolean;
  @Input() width: number;
  @Input() height: number;
  @Input() leftSideHide: boolean;
  @Input() rightSideHide: boolean;
  @Input() headerLink: 'login' | 'registration';

  staticStorageLink = `${this.envService.getStaticStorageLink}/animations/`;

  constructor(
    private readonly envService: EnvService,
    private readonly router: Router
  ) {}

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }
}
