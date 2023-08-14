import { ApiService } from '@shared/api.service';
import { Injectable } from '@angular/core';
import { MethodsEnum } from '@interfaces/methods.enum';
import { ControllersEnum } from '@interfaces/controllers.enum';
import { UsersEnum } from '@interfaces/users.enum';
import { UploadUserPhotoInterface } from '@payloads/upload-user-photo.interface';
import { Observable } from 'rxjs';
import { UserInfoInterface } from '@responses/user-info.interface';
import { PhotoUploadedEnum } from '@responses/photo-uploaded.enum';
import { UpdateUserInfoInterface } from '@payloads/update-user-info.interface';
import { UserUpdatedEnum } from '@responses/user-updated.enum';
import { UserSecurityInterface } from '@responses/user-security.interface';
import { DeleteAccountInterface } from '@payloads/delete-account.interface';
import { AccountDeletedEnum } from '@responses/account-deleted.enum';
import { SecurityEnum } from '@interfaces/security.enum';
import { ChangePasswordInterface } from '@payloads/change-password.interface';
import { PasswordChangedEnum } from '@responses/password-changed.enum';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private readonly apiService: ApiService) {}

  uploadUserPhoto(
    payload: UploadUserPhotoInterface
  ): Observable<{ message: PhotoUploadedEnum }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.POST,
      controller: ControllersEnum.USERS,
      action: UsersEnum.UPLOAD_USER_PHOTO,
      payload,
      accessToken
    });
  }

  getUserInfo(): Observable<UserInfoInterface> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.GET,
      controller: ControllersEnum.USERS,
      action: UsersEnum.USER_INFO,
      accessToken
    });
  }

  getUserSecuritySettings(): Observable<UserSecurityInterface> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.GET,
      controller: ControllersEnum.USERS,
      action: UsersEnum.USER_SECURITY,
      accessToken
    });
  }

  updateUserInfo(
    payload: UpdateUserInfoInterface
  ): Observable<{ message: UserUpdatedEnum }> {
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
    payload: DeleteAccountInterface
  ): Observable<{ message: AccountDeletedEnum }> {
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
    payload: ChangePasswordInterface
  ): Observable<{ message: PasswordChangedEnum }> {
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
