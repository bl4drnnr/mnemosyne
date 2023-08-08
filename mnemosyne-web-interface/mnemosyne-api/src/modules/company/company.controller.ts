import {Controller, Post} from '@nestjs/common';
import {CompanyService} from "@modules/company.service";

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('create-company')
  createCompany() {
    return this.companyService.createCompany();
  }
}
