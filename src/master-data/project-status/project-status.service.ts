import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ProjectStatus } from './project-status.entity';

@Injectable()
export class ProjectStatusService extends TypeOrmCrudService<ProjectStatus> {
  constructor(@InjectRepository(ProjectStatus) repo) {
    super(repo);
  }
}
