import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Methodology } from 'src/methodology/entity/methodology.entity';
import { ApplicabilityEntity } from './entity/applicability.entity';

@Injectable()
export class ApplicabilityService extends TypeOrmCrudService<ApplicabilityEntity> {
  constructor(@InjectRepository(ApplicabilityEntity) repo) {
    super(repo);
  }

  async getApplicability(): Promise<any> {
    const data = this.repo
      .createQueryBuilder('appli')
      .leftJoinAndMapMany(
        'appli.methodologies',
        Methodology,
        'meth',
        'appli.id = meth.applicabilityId',
      )
      .orderBy('appli.createdOn', 'ASC');

    const resualt = await data.getMany();

    if (resualt) {
      return resualt;
    }
  }
}
