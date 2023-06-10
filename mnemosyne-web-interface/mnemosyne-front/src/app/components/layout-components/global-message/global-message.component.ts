import { Component } from '@angular/core';
import { GlobalMessageService } from '@shared/global-message.service';

@Component({
  selector: 'layout-global-message',
  templateUrl: './global-message.component.html',
  styleUrls: ['./global-message.component.scss']
})
export class GlobalMessageComponent {
  constructor(public globalMessageService: GlobalMessageService) {}
}
