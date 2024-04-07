import { ApiService } from '@shared/api.service';
import { Injectable } from '@angular/core';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { UsersEndpoint } from '@interfaces/users.enum';
import { UploadUserPhotoPayload } from '@payloads/upload-user-photo.interface';
import { Observable } from 'rxjs';
import { UserInfoResponse } from '@responses/user-info.interface';
import { PhotoUploadedResponse } from '@responses/photo-uploaded.enum';
import { UpdateUserInfoPayload } from '@payloads/update-user-info.interface';
import { UserUpdatedResponse } from '@responses/user-updated.enum';
import { UserSecurityResponse } from '@responses/user-security.interface';
import { DeleteAccountPayload } from '@payloads/delete-account.interface';
import { AccountDeletedResponse } from '@responses/account-deleted.enum';
import { SecurityEndpoint } from '@interfaces/security.enum';
import { ChangePasswordPayload } from '@payloads/change-password.interface';
import { PasswordChangedResponse } from '@responses/password-changed.enum';
import { GetMarketplaceUserByIdPayload } from '@payloads/get-marketplace-user-by-id.interface';
import { GetMarketplaceUserByIdResponse } from '@responses/get-marketplace-user-by-id.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private readonly apiService: ApiService) {}

  uploadUserPhoto(
    payload: UploadUserPhotoPayload
  ): Observable<{ message: PhotoUploadedResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.USERS,
      action: UsersEndpoint.UPLOAD_USER_PHOTO,
      payload
    });
  }

  getUserInfo(): Observable<UserInfoResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.USERS,
      action: UsersEndpoint.USER_INFO
    });
  }

  getUserSecuritySettings(): Observable<UserSecurityResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.USERS,
      action: UsersEndpoint.USER_SECURITY
    });
  }

  updateUserInfo(
    payload: UpdateUserInfoPayload
  ): Observable<{ message: UserUpdatedResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.PATCH,
      controller: Controller.USERS,
      action: UsersEndpoint.USER_INFO,
      payload
    });
  }

  deleteAccount(
    payload: DeleteAccountPayload
  ): Observable<{ message: AccountDeletedResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.DELETE,
      controller: Controller.SECURITY,
      action: SecurityEndpoint.DELETE_ACCOUNT,
      payload
    });
  }

  changePassword(
    payload: ChangePasswordPayload
  ): Observable<{ message: PasswordChangedResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.PATCH,
      controller: Controller.SECURITY,
      action: SecurityEndpoint.CHANGE_PASSWORD,
      payload
    });
  }

  getMarketplaceUserById(
    params: GetMarketplaceUserByIdPayload
  ): Observable<GetMarketplaceUserByIdResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.USERS,
      action: UsersEndpoint.MARKETPLACE_USER,
      params
    });
  }
}
