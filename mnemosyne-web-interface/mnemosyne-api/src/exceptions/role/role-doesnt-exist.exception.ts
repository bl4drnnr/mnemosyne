import { NotFoundException } from '@nestjs/common';

export class RoleDoesntExistException extends NotFoundException {
  constructor(
    message = 'role-doesnt-exists',
    description = "Role doesn't exist"
  ) {
    super(message, description);
  }
}
