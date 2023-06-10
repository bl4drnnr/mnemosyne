import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalMessageService {
  message$ = new Subject<string>();
  isError = false;

  handle({ message, isError = false }: { message: string; isError?: boolean }) {
    this.message$.next(message);
    this.isError = isError;
  }

  clear() {
    this.message$.next('');
    this.isError = false;
  }
}
