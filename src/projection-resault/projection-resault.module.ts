import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditService } from 'src/audit/audit.service';
import { Audit } from 'src/audit/entity/audit.entity';
import { User } from 'src/users/user.entity';
import { ProjectionResault } from './entity/projection-resault.entity';
import { ProjectionResaultController } from './projection-resault.controller';
import { ProjectionResaultService } from './projection-resault.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectionResault, User, Audit])],
  controllers: [ProjectionResaultController],
  providers: [ProjectionResaultService, AuditService],
  exports: [ProjectionResaultService, AuditService],
})
export class ProjectionResaultModule {}
