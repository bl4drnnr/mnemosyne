import {
  Directive,
  Input,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';

@Directive({ selector: '[copy-clipboard]' })
export class CopyClipboardDirective {
  @Input('copy-clipboard')
  public payload: string;

  @Output('copied')
  public copied: EventEmitter<void> = new EventEmitter<void>();

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {
    event.preventDefault();
    if (!this.payload) return;

    const listener = (e: ClipboardEvent) => {
      const clipboard: any = e.clipboardData;
      clipboard.setData('text', this.payload.toString());
      e.preventDefault();

      this.copied.emit();
    };

    document.addEventListener('copy', listener, false);
    document.execCommand('copy');
    document.removeEventListener('copy', listener, false);
  }
}
