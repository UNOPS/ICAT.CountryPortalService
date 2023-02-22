import { User } from './../users/user.entity';
import { Module, Param } from '@nestjs/common';
import { InstitutionService } from './institution.service';
import { InstitutionController } from './institution.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Institution } from './institution.entity';
import { Repository } from 'typeorm';
import { InstitutionType } from './institution.type.entity';
import { InstitutionTypeService } from './institution-type.service';
import { InstitutionTypeController } from './institution-type.controller';
import { InstitutionCategory } from './institution.category.entity';
import { InstitutionCategoryService } from './institution-category.service';
import { InstitutionCategoryController } from './institution-category.controller';
import { Audit } from 'src/audit/entity/audit.entity';
import { AuditService } from 'src/audit/audit.service';
import { TokenDetails } from 'src/utills/token_details';
import { Country } from 'src/country/entity/country.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Institution,
      User,
      InstitutionType,
      InstitutionCategory,
      Audit,
      Country,
    ]),
  ],
  providers: [
    InstitutionService,
    InstitutionTypeService,
    InstitutionCategoryService,
    AuditService,
    TokenDetails,
  ],
  controllers: [
    InstitutionController,
    InstitutionTypeController,
    InstitutionCategoryController,
  ],
  exports: [
    InstitutionService,
    InstitutionTypeService,
    InstitutionCategoryService,
    AuditService,
  ],
})
export class InstitutionModule {}
