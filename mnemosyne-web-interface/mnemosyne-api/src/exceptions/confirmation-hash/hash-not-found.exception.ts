import { NotFoundException } from '@nestjs/common';

export class HashNotFoundException extends NotFoundException {
  constructor(message = 'hash-not-found', description = 'Confirmation hash not found') {
    super(message, description);
  }
}
