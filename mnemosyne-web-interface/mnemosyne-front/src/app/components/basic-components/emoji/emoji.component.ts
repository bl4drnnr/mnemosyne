import { Component, Input, OnInit } from '@angular/core';
import { EnvService } from '@shared/env.service';

@Component({
  selector: 'basic-emoji',
  templateUrl: './emoji.component.html',
  styleUrls: ['./emoji.component.scss']
})
export class EmojiComponent implements OnInit {
  @Input() isSvg: boolean;
  @Input() width: number;
  @Input() height: number;
  @Input() emoji: string;

  emojiesUrl: string;

  constructor(private envService: EnvService) {}

  ngOnInit() {
    this.emojiesUrl = `${this.envService.getStaticStorageLink}/emojies/`;
  }
}
