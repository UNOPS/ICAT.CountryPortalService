import { UnitConversion } from './../unit-conversion/entity/unit-conversion.entity';
import { Institution } from 'src/institution/institution.entity';
import { Module } from '@nestjs/common';
import { ParameterService } from './parameter.service';
import { ParameterController } from './parameter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parameter } from './entity/parameter.entity';
import { User } from 'src/users/user.entity';
import { Audit } from 'src/audit/entity/audit.entity';
import { AuditService } from 'src/audit/audit.service';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { TokenDetails } from 'src/utills/token_details';
import { EmailNotificationService } from 'src/notifications/email.notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([Parameter, Institution, UnitConversion,ParameterRequest,User,Audit])],
  controllers: [ParameterController],
  providers: [ParameterService,EmailNotificationService, Parameter,AuditService,TokenDetails],
  exports: [ParameterService,AuditService],
})
export class ParameterModule {}
