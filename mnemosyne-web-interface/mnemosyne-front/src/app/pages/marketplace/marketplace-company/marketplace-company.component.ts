import * as dayjs from 'dayjs';
import * as LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Component, OnInit } from '@angular/core';
import { TranslationService } from '@services/translation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '@services/products.service';
import { CategoriesService } from '@services/categories.service';
import { CompanyService } from '@services/company.service';

dayjs.extend(LocalizedFormat);

@Component({
  selector: 'page-marketplace-company',
  templateUrl: './marketplace-company.component.html',
  styleUrls: ['./marketplace-company.component.scss']
})
export class MarketplaceCompanyComponent implements OnInit {
  companyId: string;
  isUserLoggedIn: boolean;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly translationService: TranslationService,
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
    private readonly companyService: CompanyService
  ) {}

  getCompany() {
    //
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  ngOnInit() {
    const accessToken = localStorage.getItem('_at');
    this.isUserLoggedIn = !!accessToken;

    this.route.paramMap.subscribe(async (params) => {
      const companyId = params.get('companyId');

      if (!companyId) {
        await this.handleRedirect('marketplace');
      } else {
        this.companyId = companyId;
        this.getCompany();
      }
    });
  }
}
