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
import { SectorModule } from './master-data/sector/sector.module';
import { ProjectOwner } from './master-data/project-owner/projeect-owner.entity';
import { FinancingSchemeController } from './master-data/financing-scheme/financing-scheme.controller';
import { FinancingSchemeModule } from './master-data/financing-scheme/financing-scheme.module';
import { DocumentModule } from './document/document.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProjectOwnerModule } from './master-data/project-owner/project-owner.module';
import { ProjectStatusModule } from './master-data/project-status/project-status.module';
import { ConfigModule } from '@nestjs/config';
import { MitigationActionModule } from './master-data/mitigation-action/mitigation-action.module';
import { ProjectModule } from './project/project.module';
import { MethodologyModule } from './methodology/methodology.module';
import { MethodologyController } from './methodology/methodology.controller';
import { ProjectApprovalStatusModule } from './master-data/project-approval-status/project-approval-status.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { InstitutionModule } from './institution/institution.module';
import { UserTypeModule } from './master-data/user-type/user-type.module';
import { AssessmentModule } from './assessment/assessment.module';
import { EmissionReductionDraftdataController } from './master-data/emisssion-reduction-draft-data/emission-reduction-draftdata.controller';
import { EmissionReductionDraftdataModule } from './master-data/emisssion-reduction-draft-data/emission-reduction-draftdata.module';
import { EmissionReductioDraftDataEntity } from './master-data/emisssion-reduction-draft-data/entity/emission-reductio-draft-data.entity';
import { LearningMaterialModule } from './learning-material/learning-material.module';
import { AssessmentResultModule } from './assessment-result/assessment-result.module';
import { ProjectionResultController } from './projection-result/projection-result.controller';
import { ProjectionResultModule } from './projection-result/projection-result.module';
import { ParameterModule } from './parameter/parameter.module';
import { ParameterRequestModule } from './data-request/data-request.module';
import { AssessmentObjectiveController } from './assessment-objective/assessment-objective.controller';
import { AssessmentObjectiveModule } from './assessment-objective/assessment-objective.module';
import { AssessmentYearController } from './assessment-year/assessment-year.controller';
import { AssessmentYearModule } from './assessment-year/assessment-year.module';
import { ProjectionYearController } from './projection-year/projection-year.controller';
import { ProjectionYearModule } from './projection-year/projection-year.module';
import { DefaultValueModule } from './default-value/default-value.module';
import { ApplicabilityController } from './master-data/applicability/applicability.controller';
import { SubsectionController } from './master-data/subsection/subsection.controller';
import { SubsectionService } from './master-data/subsection/subsection.service';
import { ApplicabilityModule } from './master-data/applicability/applicability.module';
import { QualityCheckModule } from './quality-check/quality-check.module';
import { ParameterHistoryModule } from './parameter-history/parameter-history.module';
import { ReportController } from './report/report.controller';
import { ReportModule } from './report/report.module';
import { VerificationController } from './verification/verification.controller';
import { VerificationModule } from './verification/verification.module';
import { SubSectorController } from './master-data/sub-sector/sub-sector.controller';
import { SubSectorModule } from './master-data/sub-sector/sub-sector.module';
import { SubSector } from './master-data/sub-sector/entity/sub-sector.entity';
import { UnitConversionModule } from './unit-conversion/unit-conversion.module';
import { TrackClimateController } from './track-climate/track-climate.controller';
import { TrackClimateModule } from './track-climate/track-climate.module';
import { TokenDetails } from './utills/token_details';
import { MulterModule } from '@nestjs/platform-express';
import { CaActionHistoryController } from './ca-action-history/ca-action-history.controller';
import { CaActionHistoryModule } from './ca-action-history/ca-action-history.module';
import { MethodologyData } from './master-data/methodology-data/methodology-data.entity';

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
      transport: {
        host: 'smtp.office365.com',
        port: 587,
        secure: false,

        auth: {
          user: 'no-reply-icat-ca-tool@climatesi.com',
          pass: 'ICAT2022tool',
        },
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
    AssessmentModule,
    EmissionReductionDraftdataModule,
    LearningMaterialModule,
    AssessmentResultModule,
    ProjectionResultModule,
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
    ProjectionResultController,
    EmissionReductionDraftdataController,
    AssessmentObjectiveController,
    AssessmentYearController,
    ProjectionYearController,
    ApplicabilityController,
    SubsectionController,
    ReportController,
    VerificationController,
    SubSectorController,
    TrackClimateController,
    CaActionHistoryController,
  ],

  providers: [AppService, SubsectionService, TokenDetails],
})
export class AppModule {}
