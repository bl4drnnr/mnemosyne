import * as dayjs from 'dayjs';
import * as LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Component, OnInit } from '@angular/core';
import { TranslationService } from '@services/translation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '@services/products.service';
import { CategoriesService } from '@services/categories.service';
import { CompanyService } from '@services/company.service';
import { Titles } from '@interfaces/titles.enum';
import { CompanyMember } from '@responses/get-company-public-info.interface';

dayjs.extend(LocalizedFormat);

@Component({
  selector: 'page-marketplace-company',
  templateUrl: './marketplace-company.component.html',
  styleUrls: ['./marketplace-company.component.scss']
})
export class MarketplaceCompanyComponent implements OnInit {
  companyId: string;
  page: string = '0';
  pageSize: string = '10';
  query: string;
  isUserLoggedIn: boolean;

  totalItems: number;
  companyOwnerId: string;
  companyOwnerFirstName: string;
  companyOwnerLastName: string;
  companyName: string;
  companyLocation: string;
  companyWebsite: string;
  companyMembers: Array<CompanyMember>;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly translationService: TranslationService,
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
    private readonly companyService: CompanyService
  ) {}

  getCompany() {
    this.companyService
      .getCompanyPublicInformation({
        companyId: this.companyId,
        page: this.page,
        pageSize: this.pageSize,
        query: this.query
      })
      .subscribe({
        next: ({
          count,
          companyOwnerId,
          companyOwnerFirstName,
          companyOwnerLastName,
          companyName,
          companyLocation,
          companyWebsite,
          companyMembers
        }) => {
          this.translationService.setPageTitle(Titles.COMPANY, { companyName });

          this.totalItems = count;

          this.companyOwnerFirstName = companyOwnerFirstName;
          this.companyOwnerLastName = companyOwnerLastName;
          this.companyOwnerId = companyOwnerId;
          this.companyName = companyName;
          this.companyLocation = companyLocation;
          this.companyWebsite = companyWebsite;
          this.companyMembers = companyMembers;
        },
        error: () => {
          // @TODO handle not found here and everywhere else
        }
      });
  }

  getCompanyProductsStatistics() {
    this.productsService
      .getCompanyProductsStatistics({
        companyId: this.companyId
      })
      .subscribe({
        next: (res) => {
          // @TODO Create on the company page list of products, users and stats
          console.log('res', res);
        }
      });
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
        this.getCompanyProductsStatistics();
      }
    });
  }
}
