import { Component } from '@angular/core';
import { LoaderService } from '@shared/loader.service';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

@Component({
  selector: 'layout-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  animations: [
    trigger('fade', [
      state('visible', style({ opacity: 1, zIndex: 9999 })),
      state('hidden', style({ opacity: 0, zIndex: -1 })),
      transition('visible => hidden', animate('300ms ease-out'))
    ])
  ]
})
export class LoaderComponent {
  constructor(public loaderService: LoaderService) {}
}
