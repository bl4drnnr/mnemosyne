import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'layout-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  constructor(private readonly router: Router) {}

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }
}
