import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ProjectOwner } from './projeect-owner.entity';

@Injectable()
export class ProjectOwnerService extends TypeOrmCrudService<ProjectOwner> {
  constructor(@InjectRepository(ProjectOwner) repo) {
    super(repo);
  }
}
