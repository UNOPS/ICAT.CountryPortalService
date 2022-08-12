import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssesmentResaultService } from 'src/assesment-resault/assesment-resault.service';
import { AssessmentResault } from 'src/assesment-resault/entity/assessment-resault.entity';
import { AssesmentModule } from 'src/assesment/assesment.module';
import { AssesmentService } from 'src/assesment/assesment.service';
import { Assessment } from 'src/assesment/entity/assesment.entity';
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
import { SectorController } from 'src/master-data/sector/sector.controller';
import { Sector } from 'src/master-data/sector/sector.entity';
import { SectorService } from 'src/master-data/sector/sector.service';
import { ParameterHistoryModule } from 'src/parameter-history/parameter-history.module';
import { Parameter } from 'src/parameter/entity/parameter.entity';
import { ParameterService } from 'src/parameter/parameter.service';
import { Project } from 'src/project/entity/project.entity';
import { ProjectModule } from 'src/project/project.module';
import { ProjectService } from 'src/project/project.service';
import { ProjectionResault } from 'src/projection-resault/entity/projection-resault.entity';
import { UnitConversion } from 'src/unit-conversion/entity/unit-conversion.entity';
import { UsersModule } from 'src/users/users.module';
import { TokenDetails } from 'src/utills/token_details';
import { ReportPdfFileData } from './entity/report-pdfFile.entity';
import { Report } from './entity/report.entity';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Report,
      Project,
      Parameter,
      Institution,
      UnitConversion,
      AssessmentYear,
      AssessmentResault,
      AssessmentYear,
      ProjectionResault,
      Assessment,
      EmissionReductioDraftDataEntity,
      ParameterRequest,
      Ndc,
      ProjectOwner,
      ReportPdfFileData,
      DefaultValue
    ]),
    ProjectModule,
    AssesmentModule,
    HttpModule,
    ParameterHistoryModule,
    UsersModule,
    AssessmentYearModule,
    EmissionReductionDraftdataModule,
  ],
  controllers: [ReportController],
  providers: [
    ReportService,
    ParameterService,
    Parameter,
    AssessmentYearService,
    AssesmentResaultService,
    ProjectService,
    DefaultValueService,
    TokenDetails
  ],
  exports: [
    ReportService,
    ParameterService,
    AssessmentYearService,
    AssesmentResaultService,
    ProjectService,
    DefaultValueService
  ],
})
export class ReportModule {}
