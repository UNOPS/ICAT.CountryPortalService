import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MethodologyData } from './methodology-data.entity';

@Injectable()
export class MethodologyDataService extends TypeOrmCrudService<MethodologyData> {
  constructor(@InjectRepository(MethodologyData) repo) {
    super(repo);
  }
}
