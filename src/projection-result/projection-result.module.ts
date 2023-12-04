import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditService } from 'src/audit/audit.service';
import { Audit } from 'src/audit/entity/audit.entity';
import { User } from 'src/users/user.entity';
import { ProjectionResult } from './entity/projection-result.entity';
import { ProjectionResultController } from './projection-result.controller';
import { ProjectionResultService } from './projection-result.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectionResult, User, Audit])],
  controllers: [ProjectionResultController],
  providers: [ProjectionResultService, AuditService],
  exports: [ProjectionResultService, AuditService],
})
export class ProjectionResultModule {}
