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
import { GetMarketplaceCompanyStatsResponse } from '@responses/get-marketplace-company-stats.interface';

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
  quantityOfUsers: number;
  companyOwnerId: string;
  companyOwnerFirstName: string;
  companyOwnerLastName: string;
  companyName: string;
  companyLocation: string;
  companyWebsite: string;
  companyMembers: Array<CompanyMember>;
  companyStats: GetMarketplaceCompanyStatsResponse;
  currentSection: 'products' | 'users' | 'stats' = 'products';

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
          quantityOfUsers,
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
          this.quantityOfUsers = quantityOfUsers;
          this.companyOwnerFirstName = companyOwnerFirstName;
          this.companyOwnerLastName = companyOwnerLastName;
          this.companyOwnerId = companyOwnerId;
          this.companyName = companyName;
          this.companyLocation = companyLocation;
          this.companyWebsite = companyWebsite;
          this.companyMembers = companyMembers;
        },
        error: async () => await this.handleRedirect('marketplace')
      });
  }

  getCompanyProductsStatistics() {
    this.productsService
      .getCompanyProductsStatistics({
        companyId: this.companyId
      })
      .subscribe({
        next: (companyStats) => (this.companyStats = companyStats)
      });
  }

  changeCompanyQuery(query: string) {
    this.query = query;
    this.getCompany();
  }

  changeCompanyUsersPerPage(usersPerPage: string) {
    this.pageSize = usersPerPage;
    this.getCompany();
  }

  changeCompanyUsersPage(page: string) {
    this.page = page;
    this.getCompany();
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  handleExternalRedirect(path: string) {
    document.location.href = path;
  }

  handleExternalRedirectLink(path: string) {
    if (path.includes('http')) document.location.href = path;
    else document.location.href = `https://${path}`;
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
