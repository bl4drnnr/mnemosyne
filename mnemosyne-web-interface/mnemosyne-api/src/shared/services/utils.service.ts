import { Injectable } from '@nestjs/common';

type CustomObj = Record<string, any>;

@Injectable()
export class UtilsService {
  removeDuplicates<T extends CustomObj>(arr: T[], prop: keyof T): T[] {
    const uniqueMap = new Map<any, boolean>();
    return arr.filter(
      (obj) => !uniqueMap.has(obj[prop]) && uniqueMap.set(obj[prop], true)
    );
  }
}
