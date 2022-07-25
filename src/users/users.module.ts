import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditService } from 'src/audit/audit.service';
import { Audit } from 'src/audit/entity/audit.entity';
import { Country } from 'src/country/entity/country.entity';
import { Institution } from 'src/institution/institution.entity';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { TokenDetails } from 'src/utills/token_details';
import { User } from './user.entity';
import { UserType } from './user.type.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserType, Institution, Country,Audit])],
  providers: [UsersService, EmailNotificationService,AuditService,TokenDetails],
  controllers: [UsersController],
  exports: [UsersService,AuditService],
})
export class UsersModule {}
