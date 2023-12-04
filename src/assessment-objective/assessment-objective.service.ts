import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { AssessmentObjective } from './entity/assessment-objective.entity';

@Injectable()
export class AssessmentObjectiveService extends TypeOrmCrudService<AssessmentObjective> {
  constructor(@InjectRepository(AssessmentObjective) repo) {
    super(repo);
  }
}
