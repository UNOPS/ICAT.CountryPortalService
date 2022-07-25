import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ProjectApprovalStatus } from './project-approval-status.entity';

@Injectable()
export class ProjectApprovalStatusService extends TypeOrmCrudService<ProjectApprovalStatus> {
  constructor(@InjectRepository(ProjectApprovalStatus) repo) {
    super(repo);
  }
}
