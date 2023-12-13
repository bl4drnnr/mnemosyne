import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  compareArrays(a: Array<any>, b: Array<any>) {
    return (
      a.length === b.length && a.every((element, index) => element === b[index])
    );
  }
}
