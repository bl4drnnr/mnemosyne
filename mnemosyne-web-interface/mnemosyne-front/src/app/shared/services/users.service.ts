import { ApiService } from '@shared/api.service';
import { Injectable } from '@angular/core';
import { ALLOWED_METHODS } from '@interfaces/methods.type';
import { CONTROLLERS } from '@interfaces/controllers.type';
import { USERS_ENDPOINTS } from '@interfaces/users.type';
import { UploadUserPhotoPayload } from '@payloads/upload-user-photo.payload';
import { Observable } from 'rxjs';
import { UserInfoResponse } from '@responses/user-info.response';
import { PhotoUploadedResponse } from '@responses/photo-uploaded.response';
import { UpdateUserInfoPayload } from '@payloads/update-user-info.payload';
import { UserUpdatedResponse } from '@responses/user-updated.response';
import { UserSecurityResponse } from '@responses/user-security.response';
import { DeleteAccountPayload } from '@payloads/delete-account.payload';
import { AccountDeletedResponse } from '@responses/account-deleted.response';
import { SECURITY_ENDPOINTS } from '@interfaces/security.type';
import { ChangePasswordPayload } from '@payloads/change-password.payload';
import { PasswordChangedResponse } from '@responses/password-changed.response';

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
      method: ALLOWED_METHODS.POST,
      controller: CONTROLLERS.USERS,
      action: USERS_ENDPOINTS.UPLOAD_USER_PHOTO,
      payload,
      accessToken
    });
  }

  getUserInfo(): Observable<UserInfoResponse> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.GET,
      controller: CONTROLLERS.USERS,
      action: USERS_ENDPOINTS.USER_INFO,
      accessToken
    });
  }

  getUserSecuritySettings(): Observable<UserSecurityResponse> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.GET,
      controller: CONTROLLERS.USERS,
      action: USERS_ENDPOINTS.USER_SECURITY,
      accessToken
    });
  }

  updateUserInfo({
    payload
  }: {
    payload: UpdateUserInfoPayload;
  }): Observable<{ message: UserUpdatedResponse }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.PATCH,
      controller: CONTROLLERS.USERS,
      action: USERS_ENDPOINTS.USER_INFO,
      payload,
      accessToken
    });
  }

  deleteAccount(
    payload: DeleteAccountPayload
  ): Observable<{ message: AccountDeletedResponse }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.DELETE,
      controller: CONTROLLERS.USERS,
      action: USERS_ENDPOINTS.DELETE_ACCOUNT,
      payload,
      accessToken
    });
  }

  changePassword(
    payload: ChangePasswordPayload
  ): Observable<{ message: PasswordChangedResponse }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.PATCH,
      controller: CONTROLLERS.SECURITY,
      action: SECURITY_ENDPOINTS.CHANGE_PASSWORD,
      payload,
      accessToken
    });
  }
}
