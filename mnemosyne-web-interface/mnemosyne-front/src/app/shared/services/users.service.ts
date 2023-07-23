import { ApiService } from '@shared/api.service';
import { Injectable } from '@angular/core';
import { ALLOWED_METHODS_TYPE } from '@interfaces/methods.type';
import { CONTROLLERS_TYPE } from '@interfaces/controllers.type';
import { ENDPOINTS_TYPE } from '@interfaces/endpoints.type';
import { UploadUserPhotoPayload } from '@payloads/upload-user-photo.payload';
import { Observable } from 'rxjs';
import { UserInfoResponse } from '@responses/user-info.response';
import { PhotoUploadedResponse } from '@responses/photo-uploaded.response';
import { UpdateUserInfoPayload } from '@payloads/update-user-info.payload';
import { UserUpdatedResponse } from '@responses/user-updated.response';
import { UserSecurityResponse } from '@responses/user-security.response';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private readonly apiService: ApiService) {}

  uploadUserPhoto({
    userPhoto
  }: UploadUserPhotoPayload): Observable<{ message: PhotoUploadedResponse }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS_TYPE.POST,
      controller: CONTROLLERS_TYPE.USERS,
      action: ENDPOINTS_TYPE.UPLOAD_USER_PHOTO,
      payload: { userPhoto },
      accessToken
    });
  }

  getUserInfo(): Observable<UserInfoResponse> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS_TYPE.GET,
      controller: CONTROLLERS_TYPE.USERS,
      action: ENDPOINTS_TYPE.USER_INFO,
      accessToken
    });
  }

  getUserSecuritySettings(): Observable<UserSecurityResponse> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS_TYPE.GET,
      controller: CONTROLLERS_TYPE.USERS,
      action: ENDPOINTS_TYPE.USER_SECURITY,
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
      method: ALLOWED_METHODS_TYPE.PATCH,
      controller: CONTROLLERS_TYPE.USERS,
      action: ENDPOINTS_TYPE.USER_INFO,
      payload,
      accessToken
    });
  }
}
