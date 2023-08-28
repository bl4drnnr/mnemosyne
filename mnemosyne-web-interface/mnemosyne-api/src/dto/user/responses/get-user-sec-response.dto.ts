import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

class PhoneStatus {
  @ApiProperty({
    type: Boolean,
    description: DocsProperty.PHONE_STATUS_IS_SET_UP_DESC,
    example: DocsProperty.PHONE_STATUS_IS_SET_UP_EXAMPLE
  })
  readonly isSetUp: boolean;

  @ApiProperty({
    type: String,
    description: DocsProperty.PHONE_STATUS_2_LAST_DIGITS_DESC,
    example: DocsProperty.PHONE_STATUS_2_LAST_DIGITS_EXAMPLE
  })
  readonly twoLastDigit: string;
}

export class GetUserSecResponseDto {
  @ApiProperty({
    type: PhoneStatus
  })
  readonly phoneStatus: PhoneStatus;

  @ApiProperty({
    type: Boolean,
    description: DocsProperty.PASSWORD_CAN_BE_CHANGED_DESC,
    example: DocsProperty.PASSWORD_CAN_BE_CHANGED_EXAMPLE
  })
  readonly passwordCanBeChanged: boolean;

  @ApiProperty({
    type: Boolean,
    description: DocsProperty.IS_EMAIL_CHANGED_DESC,
    example: DocsProperty.IS_EMAIL_CHANGED_EXAMPLE
  })
  readonly emailChanged: boolean;

  @ApiProperty({
    type: Boolean,
    description: DocsProperty.IS_TWO_FA_SET_UP_DESC,
    example: DocsProperty.IS_TWO_FA_SET_UP_EXAMPLE
  })
  readonly isTwoFaSetUp: boolean;

  @ApiProperty({
    type: String,
    description: DocsProperty.EMAIL_DESC,
    example: DocsProperty.EMAIL_EXAMPLE
  })
  readonly email: string;

  constructor({
    phoneStatus,
    passwordCanBeChanged,
    emailChanged,
    isTwoFaSetUp,
    email
  }: {
    phoneStatus: PhoneStatus;
    passwordCanBeChanged: boolean;
    emailChanged: boolean;
    isTwoFaSetUp: boolean;
    email: string;
  }) {
    this.phoneStatus = phoneStatus;
    this.passwordCanBeChanged = passwordCanBeChanged;
    this.emailChanged = emailChanged;
    this.isTwoFaSetUp = isTwoFaSetUp;
    this.email = email;
  }
}
