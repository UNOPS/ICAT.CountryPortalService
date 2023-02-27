import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InstitutionCategory } from './institution.category.entity';

@Injectable()
export class InstitutionCategoryService extends TypeOrmCrudService<InstitutionCategory> {
  constructor(@InjectRepository(InstitutionCategory) repo) {
    super(repo);
  }
}
