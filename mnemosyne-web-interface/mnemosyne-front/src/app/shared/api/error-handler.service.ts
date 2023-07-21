import { HttpErrorResponse } from '@angular/common/http';
import { GlobalMessageService } from '@shared/global-message.service';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(
    private readonly globalMessageService: GlobalMessageService,
    private readonly translocoService: TranslocoService
  ) {}

  errorHandler(error: HttpErrorResponse) {
    // @TODO Continue here. Check the type/name of the object
    // that contains errors and render them
    const errorMessage = this.translocoService.translate(
      error.error.message,
      {},
      'messages/errors'
    );

    this.globalMessageService.handle({
      message: errorMessage,
      isError: true
    });

    setTimeout(() => {
      this.globalMessageService.clear();
    }, 10000);

    return throwError(() => error.error.message);
  }
}
