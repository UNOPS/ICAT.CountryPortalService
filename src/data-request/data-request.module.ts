import { UsersModule } from './../users/users.module';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
import { Module } from '@nestjs/common';
import { ParameterRequestService } from './data-request.service';
import { ParameterRequestController } from './data-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParameterRequest } from './entity/data-request.entity';
import { ParameterHistoryModule } from 'src/parameter-history/parameter-history.module';
import { Audit } from 'src/audit/entity/audit.entity';
import { AuditService } from 'src/audit/audit.service';
import { Parameter } from 'src/parameter/entity/parameter.entity';
import { DefaultValue } from 'src/default-value/entity/defaultValue.entity';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { Project } from 'src/project/entity/project.entity';
import { Institution } from 'src/institution/institution.entity';
import { TokenDetails } from 'src/utills/token_details';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ParameterRequest,
      User,
      Audit,
      Parameter,
      DefaultValue,
      Project,
      Institution,
    ]),
    UsersModule,
    ParameterHistoryModule,
  ],
  providers: [
    ParameterRequestService,
    AuditService,
    Parameter,
    DefaultValue,
    Project,
    EmailNotificationService,
    Institution,
    TokenDetails,
  ],
  controllers: [ParameterRequestController],
  exports: [
    ParameterRequestService,
    AuditService,
    Parameter,
    DefaultValue,
    Project,
  ],
})
export class ParameterRequestModule {}
