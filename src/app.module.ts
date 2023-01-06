import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditModule } from './audit/audit.module';
import { Audit } from './audit/entity/audit.entity';
import { ClimateChangeDataCategory } from './master-data/cimate-change-data-category/climate.change.data.category.entity';
import { Ndc } from './master-data/ndc/ndc.entity';
import { SubNdc } from './master-data/ndc/sub-ndc.entity';
import { ProjectStatus } from './master-data/project-status/project-status.entity';
import { Sector } from './master-data/sector/sector.entity';
import { Project } from './project/entity/project.entity';
import { NdcModule } from './master-data/ndc/ndc.module';
import * as ormconfig from './ormconfig';
import { Country } from './country/entity/country.entity';
import { NdcSet } from './master-data/ndc/ndc-set.entity';
import { CountryModule } from './country/country.module';
import { NdcSetService } from './master-data/ndc/ndc-set.service';
import { NdcService } from './master-data/ndc/ndc.service';
import { SectorModule } from './master-data/sector/sector.module';
import { ProjectOwner } from './master-data/project-owner/projeect-owner.entity';

import { FinancingSchemeController } from './master-data/financing-scheme/financing-scheme.controller';
import { FinancingSchemeModule } from './master-data/financing-scheme/financing-scheme.module';
import { DocumentModule } from './document/document.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SectorController } from './master-data/sector/sector.controller';
import { ProjectOwnerModule } from './master-data/project-owner/project-owner.module';
import { ProjectStatusModule } from './master-data/project-status/project-status.module';
import { ConfigModule } from '@nestjs/config';
import { MitigationActionType } from './master-data/mitigation-action/mitigation-action.entity';
import { MitigationActionModule } from './master-data/mitigation-action/mitigation-action.module';
import { ProjectModule } from './project/project.module';
import { MethodologyModule } from './methodology/methodology.module';
import { MethodologyController } from './methodology/methodology.controller';
import { ProjectApprovalStatusModule } from './master-data/project-approval-status/project-approval-status.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { InstitutionModule } from './institution/institution.module';
// import { UserController } from './user/user.controller';
// import { UserService } from './user/user.service';
import { InstitutionCategoryController } from './institution/institution-category.controller';
import { InstitutionCategoryService } from './institution/institution-category.service';
import { UserTypeModule } from './master-data/user-type/user-type.module';
import { AssesmentModule } from './assesment/assesment.module';
import { EmissionReductionDraftdataService } from './master-data/emisssion-reduction-draft-data/emission-reduction-draftdata.service';
import { EmissionReductionDraftdataController } from './master-data/emisssion-reduction-draft-data/emission-reduction-draftdata.controller';
import { EmissionReductionDraftdataModule } from './master-data/emisssion-reduction-draft-data/emission-reduction-draftdata.module';
import { EmissionReductioDraftDataEntity } from './master-data/emisssion-reduction-draft-data/entity/emission-reductio-draft-data.entity';
import { LearningMaterialModule } from './learning-material/learning-material.module';
import { AssesmentResaultModule } from './assesment-resault/assesment-resault.module';
import { ProjectionResaultController } from './projection-resault/projection-resault.controller';
import { ProjectionResaultModule } from './projection-resault/projection-resault.module';
import { ParameterModule } from './parameter/parameter.module';
import { ParameterRequestModule } from './data-request/data-request.module';
import { AssessmentObjectiveController } from './assessment-objective/assessment-objective.controller';
import { AssessmentObjectiveModule } from './assessment-objective/assessment-objective.module';
import { AssessmentYearController } from './assessment-year/assessment-year.controller';
import { AssessmentYearService } from './assessment-year/assessment-year.service';
import { AssessmentYearModule } from './assessment-year/assessment-year.module';
import { ProjectionYearController } from './projection-year/projection-year.controller';
import { ProjectionYearModule } from './projection-year/projection-year.module';
import { DefaultValueModule } from './default-value/default-value.module';
import { ApplicabilityController } from './master-data/applicability/applicability.controller';
import { ApplicabilityService } from './master-data/applicability/applicability.service';
import { SubsectionController } from './master-data/subsection/subsection.controller';
import { SubsectionService } from './master-data/subsection/subsection.service';
import { ApplicabilityModule } from './master-data/applicability/applicability.module';
import { QualityCheckModule } from './quality-check/quality-check.module';
import { ParameterHistoryModule } from './parameter-history/parameter-history.module';
import { ReportService } from './report/report.service';
import { ReportController } from './report/report.controller';
import { ReportModule } from './report/report.module';
import { VerificationController } from './verification/verification.controller';
import { VerificationService } from './verification/verification.service';
import { VerificationModule } from './verification/verification.module';
import { SubSectorController } from './master-data/sub-sector/sub-sector.controller';
import { SubSectorModule } from './master-data/sub-sector/sub-sector.module';
import { SubSector } from './master-data/sub-sector/entity/sub-sector.entity';
import { UnitConversionModule } from './unit-conversion/unit-conversion.module';
import { TrackClimateController } from './track-climate/track-climate.controller';
import { TrackClimateService } from './track-climate/track-climate.service';
import { TrackClimateModule } from './track-climate/track-climate.module';
import { TokenDetails } from './utills/token_details';
import { MulterModule } from '@nestjs/platform-express';
import { CaActionHistoryController } from './ca-action-history/ca-action-history.controller';
import { CaActionHistoryService } from './ca-action-history/ca-action-history.service';
import { CaActionHistoryModule } from './ca-action-history/ca-action-history.module';
import { MethodologyData } from './master-data/methodology-data/methodology-data.entity';
import { MethodologyDataController } from './master-data/methodology-data/methodology-data.controller';
import { MethodologyDataService } from './master-data/methodology-data/methodology-data.service';

@Module({
  imports: [
    AuditModule,
    TypeOrmModule.forRoot(ormconfig),
    MulterModule.register({
      dest: './uploads',
    }),
    TypeOrmModule.forFeature([
      Audit,
      Project,
      ProjectStatus,
      ProjectOwner,
      SubNdc,
      Ndc,
      Sector,
      SubSector,
      ClimateChangeDataCategory,
      Country,
      NdcSet,
      EmissionReductioDraftDataEntity,
    ]),

    ProjectModule,
    AuditModule,
    CountryModule,
    NdcModule,
    MitigationActionModule,
    ProjectOwnerModule,
    SectorModule,
    ProjectStatusModule,
    FinancingSchemeModule,
    DocumentModule,
    AuthModule,
    UsersModule,
    InstitutionModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../static-files'),
      renderPath: 'icatcountryportal',
      exclude: ['/api*'],
      serveStaticOptions: { index: false },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRoot({
      transport:{
        // service: 'gmail',
        host: 'smtp.office365.com', 
        port:587,
       secure: false, 
      //  ignoreTLS: true,
       
       auth: {
        user: "no-reply-icat-ca-tool@climatesi.com",
        pass: "ICAT2022tool",
        // user: "pradeep@climatesi.com",
        // pass: "RPpkr95#",

      },
        // 'smtp://janiya.rolfson49@ethereal.email:T8pnMS7xzzX7k3QSkM@ethereal.email',
      },
      defaults: {
        from: '"Admin" <no-reply-icat-ca-tool@climatesi.com>',
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MethodologyModule,
    ProjectApprovalStatusModule,
    UserTypeModule,
    AssesmentModule,
    EmissionReductionDraftdataModule,
    LearningMaterialModule,
    AssesmentResaultModule,
    ProjectionResaultModule,
    ParameterModule,
    ParameterRequestModule,
    AssessmentObjectiveModule,
    AssessmentYearModule,
    ProjectionYearModule,
    DefaultValueModule,
    ApplicabilityModule,
    MethodologyData,
    QualityCheckModule,
    ParameterHistoryModule,
    ReportModule,
    VerificationModule,
    SubSectorModule,
    UnitConversionModule,
    TrackClimateModule,
    CaActionHistoryModule,
    
  ],
  controllers: [
    AppController,
    FinancingSchemeController,
    FinancingSchemeController,
    MethodologyController,
    ProjectionResaultController,

    EmissionReductionDraftdataController,

    AssessmentObjectiveController,

    AssessmentYearController,

    ProjectionYearController,

    ApplicabilityController,

    // MethodologyDataController,

    SubsectionController,

    ReportController,

    VerificationController,

    SubSectorController,
    TrackClimateController,
    CaActionHistoryController,
    // InstitutionCategoryController,
    // UserController,
  ],

  providers: [AppService, SubsectionService,TokenDetails,],
})
export class AppModule {}
