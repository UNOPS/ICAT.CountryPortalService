import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { Ndc } from 'src/master-data/ndc/ndc.entity';
import { SubNdc } from 'src/master-data/ndc/sub-ndc.entity';
import { ProjectStatus } from 'src/master-data/project-status/project-status.entity';
import { Sector } from 'src/master-data/sector/sector.entity';
import { AssessmentYearController } from './assessment-year.controller';
import { AssessmentYearService } from './assessment-year.service';
import { AssessmentYear } from './entity/assessment-year.entity';
import { ParameterHistoryModule } from 'src/parameter-history/parameter-history.module';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/user.entity';
import { Audit } from 'src/audit/entity/audit.entity';
import { AuditService } from 'src/audit/audit.service';
import { TokenDetails } from 'src/utills/token_details';
import { Institution } from 'src/institution/institution.entity';
import { ParameterHistoryService } from 'src/parameter-history/parameter-history.service';
import { UserTypeService } from 'src/master-data/user-type/user.type.service';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AssessmentYear,User,Audit,Institution]),
    ParameterHistoryModule,
    UsersModule,
  ],
  controllers: [AssessmentYearController],
  providers: [AssessmentYearService, EmailNotificationService,AuditService,TokenDetails,Institution,User],
  exports: [AssessmentYearService,AuditService],
})
export class AssessmentYearModule {}
