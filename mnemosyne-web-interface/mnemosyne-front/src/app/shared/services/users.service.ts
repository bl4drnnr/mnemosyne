import { ApiService } from '@shared/api.service';
import { Injectable } from '@angular/core';
import { MethodsEnum } from '@interfaces/methods.enum';
import { ControllersEnum } from '@interfaces/controllers.enum';
import { UsersEnum } from '@interfaces/users.enum';
import { UploadUserPhotoPayload } from '@payloads/upload-user-photo.payload';
import { Observable } from 'rxjs';
import { UserInfoResponse } from '@responses/user-info.response';
import { PhotoUploadedResponse } from '@responses/photo-uploaded.response';
import { UpdateUserInfoPayload } from '@payloads/update-user-info.payload';
import { UserUpdatedResponse } from '@responses/user-updated.response';
import { UserSecurityResponse } from '@responses/user-security.response';
import { DeleteAccountPayload } from '@payloads/delete-account.payload';
import { AccountDeletedResponse } from '@responses/account-deleted.response';
import { SecurityEnum } from '@interfaces/security.enum';
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
      method: MethodsEnum.POST,
      controller: ControllersEnum.USERS,
      action: UsersEnum.UPLOAD_USER_PHOTO,
      payload,
      accessToken
    });
  }

  getUserInfo(): Observable<UserInfoResponse> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.GET,
      controller: ControllersEnum.USERS,
      action: UsersEnum.USER_INFO,
      accessToken
    });
  }

  getUserSecuritySettings(): Observable<UserSecurityResponse> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.GET,
      controller: ControllersEnum.USERS,
      action: UsersEnum.USER_SECURITY,
      accessToken
    });
  }

  updateUserInfo(
    payload: UpdateUserInfoPayload
  ): Observable<{ message: UserUpdatedResponse }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.PATCH,
      controller: ControllersEnum.USERS,
      action: UsersEnum.USER_INFO,
      payload,
      accessToken
    });
  }

  deleteAccount(
    payload: DeleteAccountPayload
  ): Observable<{ message: AccountDeletedResponse }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.DELETE,
      controller: ControllersEnum.USERS,
      action: UsersEnum.DELETE_ACCOUNT,
      payload,
      accessToken
    });
  }

  changePassword(
    payload: ChangePasswordPayload
  ): Observable<{ message: PasswordChangedResponse }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.PATCH,
      controller: ControllersEnum.SECURITY,
      action: SecurityEnum.CHANGE_PASSWORD,
      payload,
      accessToken
    });
  }
}
