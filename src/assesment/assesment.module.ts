import { UsersModule } from './../users/users.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentObjective } from 'src/assessment-objective/entity/assessment-objective.entity';
import { AssessmentYear } from 'src/assessment-year/entity/assessment-year.entity';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { ApplicabilityEntity } from 'src/master-data/applicability/entity/applicability.entity';
import { Parameter } from 'src/parameter/entity/parameter.entity';
import { Project } from 'src/project/entity/project.entity';
import { ProjectionYear } from 'src/projection-year/entity/projection-year.entity';
import { AssesmentController } from './assesment.controller';
import { AssesmentService } from './assesment.service';
import { Assessment } from './entity/assesment.entity';
import { AuditService } from 'src/audit/audit.service';
import { Audit } from 'src/audit/entity/audit.entity';
import { User } from 'src/users/user.entity';
import { Methodology } from 'src/methodology/entity/methodology.entity';
import { TokenDetails } from 'src/utills/token_details';
import { Institution } from 'src/institution/institution.entity';
import { EmailNotificationService } from 'src/notifications/email.notification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Assessment,
      Parameter,
      AssessmentYear,
      ProjectionYear,
      Project,
      AssessmentObjective,
      ApplicabilityEntity,
      ParameterRequest,
      Institution,
      Audit,
      User,
      Methodology,
    ]),
    UsersModule,
  ],
  controllers: [AssesmentController],
  providers: [
    AssesmentService,
    Parameter,
    AssessmentYear,
    ProjectionYear,
    Project,
    AssessmentObjective,
    ApplicabilityEntity,
    ParameterRequest,
    Institution,
    AuditService,
    Methodology,
    TokenDetails,
    EmailNotificationService,
  ],
  exports: [
    AssesmentService,
    Parameter,
    AssessmentYear,
    AuditService,
    EmailNotificationService,
  ],
})
export class AssesmentModule {}
