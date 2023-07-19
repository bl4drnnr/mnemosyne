import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { ALLOWED_METHODS_TYPE } from '@interfaces/methods.type';
import { CONTROLLERS_TYPE } from '@interfaces/controllers.type';
import { ENDPOINTS_TYPE } from '@interfaces/endpoints.type';

@Injectable({
  providedIn: 'root'
})
export class UserPhotoService {
  constructor(private apiService: ApiService) {}

  upload({ file, accessToken }: { file: File; accessToken: string }) {
    const formData: FormData = new FormData();

    formData.append('file', file);

    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS_TYPE.POST,
      controller: CONTROLLERS_TYPE.USERS,
      action: ENDPOINTS_TYPE.UPLOAD_USER_PHOTO,
      payload: { formData },
      accessToken
    });
  }
}
