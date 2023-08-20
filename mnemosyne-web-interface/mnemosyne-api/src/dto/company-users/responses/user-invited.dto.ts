export class UserInvitedDto {
  readonly message: string;

  constructor(message = 'user-invited') {
    this.message = message;
  }
}
