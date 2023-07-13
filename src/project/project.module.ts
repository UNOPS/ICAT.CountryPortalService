import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditService } from 'src/audit/audit.service';
import { Audit } from 'src/audit/entity/audit.entity';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { User } from 'src/users/user.entity';
import { TokenDetails } from 'src/utills/token_details';
import { Project } from './entity/project.entity';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { Assessment } from 'src/assessment/entity/assessment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Audit, User, Assessment])],
  controllers: [ProjectController],
  providers: [
    ProjectService,
    EmailNotificationService,
    AuditService,
    TokenDetails,
  ],
  exports: [ProjectService, AuditService],
})
export class ProjectModule {}
