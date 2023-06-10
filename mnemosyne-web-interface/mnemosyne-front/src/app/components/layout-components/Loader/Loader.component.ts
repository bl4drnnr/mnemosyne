import { Component, Input } from '@angular/core';

@Component({
  selector: 'layout-loader',
  templateUrl: './Loader.component.html',
  styleUrls: ['./Loader.component.scss']
})
export class LoaderComponent {
  @Input() loading: boolean;
}
