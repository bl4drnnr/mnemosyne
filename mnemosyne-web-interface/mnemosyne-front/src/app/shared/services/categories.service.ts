import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { CategoriesEndpoint } from '@interfaces/categories.enum';
import { GetAllCategoriesResponse } from '@responses/get-all-categories.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  constructor(private readonly apiService: ApiService) {}

  getAllCategories(): Observable<{
    categories: Array<GetAllCategoriesResponse>;
  }> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.CATEGORIES,
      action: CategoriesEndpoint.ALL_CATEGORIES
    });
  }
}
