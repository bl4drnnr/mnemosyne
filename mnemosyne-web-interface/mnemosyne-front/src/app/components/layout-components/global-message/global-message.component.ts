import { Component, OnInit } from '@angular/core';
import { GlobalMessageService } from '@shared/global-message.service';
import { EnvService } from '@shared/env.service';

@Component({
  selector: 'layout-global-message',
  templateUrl: './global-message.component.html',
  styleUrls: ['./global-message.component.scss']
})
export class GlobalMessageComponent implements OnInit {
  closeButtonUrl: string;

  constructor(
    public globalMessageService: GlobalMessageService,
    private envService: EnvService
  ) {}

  staticStorageLink: string = this.envService.getStaticStorageLink;

  ngOnInit(): void {
    this.closeButtonUrl = `${this.staticStorageLink}/icons/close.svg`;
  }
}
