import { Component, Input } from '@angular/core';

@Component({
  selector: 'basic-loader',
  templateUrl: './Loader.component.html',
  styleUrls: ['./Loader.component.scss']
})
export class LoaderComponent {
  @Input() loading: boolean;
}
