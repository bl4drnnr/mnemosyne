import { Component } from '@angular/core';
import { LoaderService } from '@shared/loader.service';

@Component({
  selector: 'layout-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  constructor(public loaderService: LoaderService) {}
}
