import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MitigationActionType } from './mitigation-action.entity';

@Injectable()
export class MitigationActionService extends TypeOrmCrudService<MitigationActionType> {
  constructor(@InjectRepository(MitigationActionType) repo) {
    super(repo);
  }
}
