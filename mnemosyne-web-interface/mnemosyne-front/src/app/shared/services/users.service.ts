import { ApiService } from '@shared/api.service';
import { Injectable } from '@angular/core';
import { ALLOWED_METHODS_TYPE } from '@interfaces/methods.type';
import { CONTROLLERS_TYPE } from '@interfaces/controllers.type';
import { ENDPOINTS_TYPE } from '@interfaces/endpoints.type';
import { UploadUserPhotoPayload } from '@payloads/upload-user-photo.payload';
import { Observable } from 'rxjs';
import { UserInfoResponse } from '@responses/user-info.response';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private readonly apiService: ApiService) {}

  uploadUserPhoto({ userPhoto, accessToken }: UploadUserPhotoPayload) {
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS_TYPE.POST,
      controller: CONTROLLERS_TYPE.USERS,
      action: ENDPOINTS_TYPE.UPLOAD_USER_PHOTO,
      payload: { userPhoto },
      accessToken
    });
  }

  getUserInfo({
    accessToken
  }: {
    accessToken: string;
  }): Observable<UserInfoResponse> {
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS_TYPE.GET,
      controller: CONTROLLERS_TYPE.USERS,
      action: ENDPOINTS_TYPE.USER_INFO,
      accessToken
    });
  }
}
