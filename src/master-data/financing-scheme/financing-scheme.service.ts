import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { FinancingScheme } from './financing-scheme.entity';

@Injectable()
export class FinancingSchemeService extends TypeOrmCrudService<FinancingScheme> {
  constructor(@InjectRepository(FinancingScheme) repo) {
    super(repo);
  }
}
