import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { SubNdc } from './sub-ndc.entity';

@Injectable()
export class SubNdcService extends TypeOrmCrudService<SubNdc>{
    constructor(@InjectRepository(SubNdc) repo) {
        super(repo);
      }
}
