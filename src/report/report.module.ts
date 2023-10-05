import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentResultService } from 'src/assessment-result/assessment-result.service';
import { AssessmentResult } from 'src/assessment-result/entity/assessment-result.entity';
import { AssessmentModule } from 'src/assessment/assessment.module';
import { Assessment } from 'src/assessment/entity/assessment.entity';
import { AssessmentYearModule } from 'src/assessment-year/assessment-year.module';
import { AssessmentYearService } from 'src/assessment-year/assessment-year.service';
import { AssessmentYear } from 'src/assessment-year/entity/assessment-year.entity';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { DefaultValueService } from 'src/default-value/default-value.service';
import { DefaultValue } from 'src/default-value/entity/defaultValue.entity';
import { Institution } from 'src/institution/institution.entity';
import { EmissionReductionDraftdataModule } from 'src/master-data/emisssion-reduction-draft-data/emission-reduction-draftdata.module';
import { EmissionReductioDraftDataEntity } from 'src/master-data/emisssion-reduction-draft-data/entity/emission-reductio-draft-data.entity';
import { Ndc } from 'src/master-data/ndc/ndc.entity';
import { ProjectOwner } from 'src/master-data/project-owner/projeect-owner.entity';
import { ParameterHistoryModule } from 'src/parameter-history/parameter-history.module';
import { Parameter } from 'src/parameter/entity/parameter.entity';
import { ParameterService } from 'src/parameter/parameter.service';
import { Project } from 'src/project/entity/project.entity';
import { ProjectModule } from 'src/project/project.module';
import { ProjectService } from 'src/project/project.service';
import { ProjectionResult } from 'src/projection-result/entity/projection-result.entity';
import { UnitConversion } from 'src/unit-conversion/entity/unit-conversion.entity';
import { UsersModule } from 'src/users/users.module';
import { TokenDetails } from 'src/utills/token_details';
import { ReportPdfFileData } from './entity/report-pdfFile.entity';
import { Report } from './entity/report.entity';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Report,
      Project,
      Parameter,
      Institution,
      UnitConversion,
      AssessmentYear,
      AssessmentResult,
      AssessmentYear,
      ProjectionResult,
      Assessment,
      EmissionReductioDraftDataEntity,
      ParameterRequest,
      Ndc,
      ProjectOwner,
      ReportPdfFileData,
      DefaultValue,
    ]),
    ProjectModule,
    AssessmentModule,
    HttpModule,
    ParameterHistoryModule,
    UsersModule,
    AssessmentYearModule,
    EmissionReductionDraftdataModule,
    StorageModule
  ],
  controllers: [ReportController],
  providers: [
    ReportService,
    ParameterService,
    Parameter,
    AssessmentYearService,
    AssessmentResultService,
    ProjectService,
    DefaultValueService,
    TokenDetails,
  ],
  exports: [
    ReportService,
    ParameterService,
    AssessmentYearService,
    AssessmentResultService,
    ProjectService,
    DefaultValueService,
  ],
})
export class ReportModule {}
