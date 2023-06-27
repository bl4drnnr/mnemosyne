import { Component } from '@angular/core';
import { EnvService } from '@shared/env.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private readonly envService: EnvService) {}

  animationOptions = {
    path: `${this.envService.getStaticStorageLink}/animations/blockchain_technology_home.json`
  };
}
