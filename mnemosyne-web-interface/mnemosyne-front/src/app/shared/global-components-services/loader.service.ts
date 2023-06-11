import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  isLoading$ = new Subject<boolean>();

  start() {
    this.isLoading$.next(true);
  }

  stop() {
    this.isLoading$.next(false);
  }
}
