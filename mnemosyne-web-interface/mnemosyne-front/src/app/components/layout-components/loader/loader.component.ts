import { Component, Input } from '@angular/core';

@Component({
  selector: 'layout-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  @Input() loading: boolean;
}
