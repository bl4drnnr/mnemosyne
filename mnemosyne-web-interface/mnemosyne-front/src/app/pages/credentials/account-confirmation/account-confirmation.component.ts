import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@pages/shared/authentication.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-account-confirmation',
  templateUrl: './account-confirmation.component.html',
  styleUrls: ['../credentials.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0s', style({ opacity: 0 })),
        animate('0.5s ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class AccountConfirmationComponent implements OnInit {
  step = 1;

  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async confirmUserAccount(hash: string) {
    await this.authenticationService
      .confirmAccount({ hash })
      .subscribe(({ message }) => {
        if (message === 'account-confirmed') this.step = 2;
        else this.step = 3;
      });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      const hash = params.get('hash');
      if (!hash) await this.router.navigate(['login']);
      else await this.confirmUserAccount(hash);
    });
  }
}
