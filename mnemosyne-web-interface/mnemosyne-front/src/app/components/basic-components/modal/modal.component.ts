import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { EnvService } from '@shared/env.service';

@Component({
  selector: 'basic-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnChanges {
  @Input() header: string;
  @Input() description: string;
  @Input() showModal: boolean;

  @Output() closeModal = new EventEmitter<void>();

  constructor(private readonly envService: EnvService) {}

  staticStorageLink = this.envService.getStaticStorageLink;

  ngOnChanges(changes: SimpleChanges) {
    document.body.style.overflow =
      changes['showModal'] && changes['showModal'].currentValue === true
        ? 'hidden'
        : 'auto';
  }
}
