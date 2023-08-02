import { NotFoundException } from '@nestjs/common';

export class LinkExpiredException extends NotFoundException {
  constructor(message = 'link-expired') {
    super(message);
  }
}
