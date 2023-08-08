import { Injectable } from '@nestjs/common';
import {Company} from "@models/company.model";
import {InjectModel} from "@nestjs/sequelize";

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company)
    private readonly companyRepository: typeof Company
  ) {}

  createCompany() {}
}
