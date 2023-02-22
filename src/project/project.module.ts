import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditService } from 'src/audit/audit.service';
import { Audit } from 'src/audit/entity/audit.entity';
import { Ndc } from 'src/master-data/ndc/ndc.entity';
import { SubNdc } from 'src/master-data/ndc/sub-ndc.entity';
import { ProjectStatus } from 'src/master-data/project-status/project-status.entity';
import { Sector } from 'src/master-data/sector/sector.entity';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { User } from 'src/users/user.entity';
import { TokenDetails } from 'src/utills/token_details';
import { Project } from './entity/project.entity';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Audit, User])],
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
