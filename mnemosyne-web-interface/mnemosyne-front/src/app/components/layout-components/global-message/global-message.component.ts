import { Component, OnInit } from '@angular/core';
import { GlobalMessageService } from '@shared/global-message.service';
import { EnvService } from '@shared/env.service';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";

@Component({
  selector: 'layout-global-message',
  templateUrl: './global-message.component.html',
  styleUrls: ['./global-message.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0, transform: 'translateY(-10px)' })),
      transition('void <=> *', animate('300ms ease-in-out'))
    ])
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: [
        { scope: 'messages/errors', alias: 'errors' },
        { scope: 'messages/responses', alias: 'responses' }
      ]
    }
  ]
})
export class GlobalMessageComponent implements OnInit {
  closeButtonUrl: string;
  successIcon: string;
  errorIcon: string;

  constructor(
    public globalMessageService: GlobalMessageService,
    private readonly translocoService: TranslocoService,
    private readonly envService: EnvService
  ) {}

  staticStorageLink: string = this.envService.getStaticStorageLink;

  ngOnInit() {
    this.closeButtonUrl = `${this.staticStorageLink}/icons/close.svg`;
    this.successIcon = `${this.staticStorageLink}/icons/check-circle.svg`;
    this.errorIcon = `${this.staticStorageLink}/icons/error.svg`;
  }
}
