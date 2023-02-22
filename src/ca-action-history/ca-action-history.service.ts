import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CaActionHistory } from './entity/ca-action-history.entity';

@Injectable()
export class CaActionHistoryService extends TypeOrmCrudService<CaActionHistory> {
  constructor(@InjectRepository(CaActionHistory) repo) {
    super(repo);
  }
}
