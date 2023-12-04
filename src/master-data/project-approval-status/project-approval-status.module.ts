import { Module } from '@nestjs/common';
import { ProjectApprovalStatusService } from './project-approval-status.service';
import { ProjectApprovalStatusController } from './project-approval-status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectApprovalStatus } from './project-approval-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectApprovalStatus])],
  controllers: [ProjectApprovalStatusController],
  providers: [ProjectApprovalStatusService],
  exports: [ProjectApprovalStatusService],
})
export class ProjectApprovalStatusModule {}
