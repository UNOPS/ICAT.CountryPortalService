import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Institution } from 'src/institution/institution.entity';
import { UserType } from 'src/users/user.type.entity';
import { InstitutionModule } from 'src/institution/institution.module';
import { User } from 'src/users/user.entity';
import { Country } from 'src/country/entity/country.entity';
import { Audit } from 'src/audit/entity/audit.entity';
import { AuditService } from 'src/audit/audit.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '600s' },
    }),
    TypeOrmModule.forFeature([Institution, UserType, User, Country,Audit]),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    EmailNotificationService,
    UsersService,
    ConfigService,
    AuditService
  ],
  exports: [AuthService,AuditService],
  controllers: [AuthController],
})
export class AuthModule {}
