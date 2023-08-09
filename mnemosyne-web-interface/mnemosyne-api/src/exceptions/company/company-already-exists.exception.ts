import { BadRequestException } from '@nestjs/common';

export class CompanyAlreadyExistsException extends BadRequestException {
  constructor(message = 'company-already-exists') {
    super(message);
  }
}
