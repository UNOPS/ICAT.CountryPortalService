import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { NdcSet } from './ndc-set.entity';

@Injectable()
export class NdcSetService extends TypeOrmCrudService<NdcSet> {
    constructor(@InjectRepository(NdcSet) repo) {
        super(repo);
      }
}
