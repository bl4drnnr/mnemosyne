import { getSchemaPath } from '@nestjs/swagger';
import { ForgotPasswordDto } from '@dto/forgot-password.dto';
import { ResetPasswordEmailDto } from '@dto/reset-password-email.dto';
import { PasswordChangedException } from '@exceptions/password-changed.exception';
import { WrongTimeframeException } from '@exceptions/wrong-timeframe.exception';
import { PhotoUploadedDto } from '@dto/photo-uploaded.dto';
import { UploadPhotoDto } from '@dto/upload-photo.dto';
import { WrongPictureException } from '@exceptions/wrong-picture.exception';
import { GetUserInfoResponseDto } from '@dto/get-user-info-response.dto';
import { GetUserSecResponseDto } from '@dto/get-user-sec-response.dto';
import { UpdateUserInfoDto } from '@dto/update-user-info.dto';
import { UserUpdatedDto } from '@dto/user-updated.dto';
import { ApiBodyOptions } from '@nestjs/swagger/dist/decorators/api-body.decorator';

export abstract class UsersDocs {
  static get ForgotPassword() {
    const ApiModels = [
      ResetPasswordEmailDto,
      ForgotPasswordDto,
      PasswordChangedException,
      WrongTimeframeException
    ];

    const apiOperationSum =
      'Endpoint is responsible for initiation of password reset.';
    const apiResponseDesc =
      'In both cases - if user exists or not, user will get the same response saying that email with password reset link has been sent.';
    const apiForbiddenDesc =
      'In case if password has been changed within 24h, user will not be able to continue.';
    const apiBadRequestRespDesc =
      'Bad request error is sent to user if user will try to send more than 1 reset request within 180 seconds.';
    const apiBodyDesc =
      'In order to reset password user has to provide only email.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(ResetPasswordEmailDto) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { $ref: getSchemaPath(WrongTimeframeException) }
      },
      ApiForbiddenResponse: {
        description: apiForbiddenDesc,
        schema: { $ref: getSchemaPath(PasswordChangedException) }
      },
      ApiBody: {
        type: ForgotPasswordDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(ForgotPasswordDto) }
      } as ApiBodyOptions
    };
  }

  static get UploadUserPhoto() {
    const ApiModels = [PhotoUploadedDto, UploadPhotoDto, WrongPictureException];

    const apiOperationSum =
      'Endpoint is responsible for upload of the user photo.';
    const apiResponseDesc =
      'As a response user gets message that photo is uploaded.';
    const apiBadRequestRespDesc =
      'If user tries to upload something else except of base64-encoded PNG picture.';
    const apiBodyDesc = 'Body contains base64-encoded PNG picture.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(PhotoUploadedDto) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { $ref: getSchemaPath(WrongPictureException) }
      },
      ApiBody: {
        type: UploadPhotoDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(UploadPhotoDto) }
      } as ApiBodyOptions
    };
  }

  static get GetUserInfo() {
    const ApiModels = [GetUserInfoResponseDto];

    const apiOperationSum =
      'Endpoint is responsible for getting user personal information.';
    const apiResponseDesc = 'As a response user gets personal information.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(GetUserInfoResponseDto) }
      }
    };
  }

  static get GetUserSecurity() {
    const ApiModels = [GetUserSecResponseDto];

    const apiOperationSum =
      'Endpoint is responsible for getting user security settings.';
    const apiResponseDesc = 'As a response user gets security settings.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(GetUserSecResponseDto) }
      }
    };
  }

  static get UpdateUserInfo() {
    const ApiModels = [UserUpdatedDto, UpdateUserInfoDto];

    const apiOperationSum =
      'Endpoint is responsible for updating user information.';
    const apiResponseDesc =
      'As a response user gets message that information has been updated';
    const apiBodyDesc = 'Body contains user personal information.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(UserUpdatedDto) }
      },
      ApiBody: {
        type: UpdateUserInfoDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(UpdateUserInfoDto) }
      } as ApiBodyOptions
    };
  }
}
