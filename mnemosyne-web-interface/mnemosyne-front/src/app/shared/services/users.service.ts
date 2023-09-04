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

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private readonly apiService: ApiService) {}

  uploadUserPhoto(
    payload: UploadUserPhotoPayload
  ): Observable<{ message: PhotoUploadedResponse }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.USERS,
      action: UsersEndpoint.UPLOAD_USER_PHOTO,
      payload,
      accessToken
    });
  }

  getUserInfo(): Observable<UserInfoResponse> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.USERS,
      action: UsersEndpoint.USER_INFO,
      accessToken
    });
  }

  getUserSecuritySettings(): Observable<UserSecurityResponse> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.USERS,
      action: UsersEndpoint.USER_SECURITY,
      accessToken
    });
  }

  updateUserInfo(
    payload: UpdateUserInfoPayload
  ): Observable<{ message: UserUpdatedResponse }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: Method.PATCH,
      controller: Controller.USERS,
      action: UsersEndpoint.USER_INFO,
      payload,
      accessToken
    });
  }

  deleteAccount(
    payload: DeleteAccountPayload
  ): Observable<{ message: AccountDeletedResponse }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: Method.DELETE,
      controller: Controller.SECURITY,
      action: SecurityEndpoint.DELETE_ACCOUNT,
      payload,
      accessToken
    });
  }

  changePassword(
    payload: ChangePasswordPayload
  ): Observable<{ message: PasswordChangedResponse }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: Method.PATCH,
      controller: Controller.SECURITY,
      action: SecurityEndpoint.CHANGE_PASSWORD,
      payload,
      accessToken
    });
  }
}
