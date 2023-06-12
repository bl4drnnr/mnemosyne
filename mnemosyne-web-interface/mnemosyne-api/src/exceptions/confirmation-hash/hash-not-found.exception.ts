import { NotFoundException } from '@nestjs/common';

export class HashNotFoundException extends NotFoundException {
  constructor(message = 'hash-not-found', description = 'Hash not found') {
    super(message, description);
  }
}
