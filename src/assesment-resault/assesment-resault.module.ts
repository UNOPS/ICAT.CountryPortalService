import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssesmentModule } from 'src/assesment/assesment.module';
import { AssesmentService } from 'src/assesment/assesment.service';
import { Assessment } from 'src/assesment/entity/assesment.entity';
import { AssessmentYear } from 'src/assessment-year/entity/assessment-year.entity';
import { AuditService } from 'src/audit/audit.service';
import { Audit } from 'src/audit/entity/audit.entity';
import { Institution } from 'src/institution/institution.entity';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { ProjectionResault } from 'src/projection-resault/entity/projection-resault.entity';
import { User } from 'src/users/user.entity';
import { UsersModule } from 'src/users/users.module';
import { TokenDetails } from 'src/utills/token_details';
import { AssesmentResaultController } from './assesment-resault.controller';
import { AssesmentResaultService } from './assesment-resault.service';
import { AssessmentResault } from './entity/assessment-resault.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AssessmentResault,
      AssessmentYear,
      ProjectionResault,
      Assessment,
      User,
      Audit,
      Institution,
    ]),
    AssesmentModule,
    HttpModule,
    UsersModule,
  ],
  controllers: [AssesmentResaultController],
  providers: [
    AssesmentResaultService,
    AssessmentYear,
    ProjectionResault,
    Assessment,
    AuditService,
    EmailNotificationService,
    TokenDetails,
  ],
  exports: [AssesmentResaultService, AuditService],
})
export class AssesmentResaultModule {}
