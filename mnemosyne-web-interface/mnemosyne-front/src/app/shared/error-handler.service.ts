import { HttpErrorResponse } from '@angular/common/http';
import { GlobalMessageService } from '@shared/global-message.service';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private globalMessageService: GlobalMessageService) {}

  errorHandler(error: HttpErrorResponse) {
    this.globalMessageService.handle({
      message: error.error.message,
      isError: true
    });
    return throwError(() => error.error.message);
  }
}
