import { Component } from '@angular/core';
import { EnvService } from '@shared/env.service';
import { Router } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('buttonAnimation', [
      state(
        'hidden',
        style({
          opacity: 0,
          transform: 'translateY(-80px)',
          filter: 'blur(15px)'
        })
      ),
      state(
        'visible',
        style({ opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' })
      ),
      transition('hidden => visible', animate('1000ms ease-in')),
      transition('visible => hidden', animate('1000ms ease-out'))
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(-80px)',
          filter: 'blur(15px)'
        }),
        animate(
          '1000ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' })
        )
      ])
    ])
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: [{ scope: 'credentials/registration', alias: 'reg' }]
    }
  ]
})
export class HomeComponent {
  currentTypingText = 1;

  constructor(
    private readonly envService: EnvService,
    private readonly router: Router
  ) {}

  animationOptions = {
    path: `${this.envService.getStaticStorageLink}/animations/blockchain_technology_home.json`
  };

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }
}
