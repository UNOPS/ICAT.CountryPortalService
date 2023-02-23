import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentModule } from 'src/assessment/assessment.module';
import { Assessment } from 'src/assessment/entity/assessment.entity';
import { AssessmentYear } from 'src/assessment-year/entity/assessment-year.entity';
import { AuditService } from 'src/audit/audit.service';
import { Audit } from 'src/audit/entity/audit.entity';
import { Institution } from 'src/institution/institution.entity';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { ProjectionResult } from 'src/projection-result/entity/projection-result.entity';
import { User } from 'src/users/user.entity';
import { UsersModule } from 'src/users/users.module';
import { TokenDetails } from 'src/utills/token_details';
import { AssessmentResultController } from './assessment-result.controller';
import { AssessmentResultService } from './assessment-result.service';
import { AssessmentResult } from './entity/assessment-result.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AssessmentResult,
      AssessmentYear,
      ProjectionResult,
      Assessment,
      User,
      Audit,
      Institution,
    ]),
    AssessmentModule,
    HttpModule,
    UsersModule,
  ],
  controllers: [AssessmentResultController],
  providers: [
    AssessmentResultService,
    AssessmentYear,
    ProjectionResult,
    Assessment,
    AuditService,
    EmailNotificationService,
    TokenDetails,
  ],
  exports: [AssessmentResultService, AuditService],
})
export class AssessmentResultModule {}
