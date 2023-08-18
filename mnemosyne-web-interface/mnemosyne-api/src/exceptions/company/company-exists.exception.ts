import { BadRequestException } from '@nestjs/common';

export class CompanyExistsException extends BadRequestException {
  constructor(message = 'company-already-exists') {
    super(message);
  }
}
