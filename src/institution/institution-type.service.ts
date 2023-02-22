import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from 'src/users/user.entity';
import { UserType } from 'src/users/user.type.entity';
import { Repository } from 'typeorm-next';
import { Institution } from './institution.entity';
import { InstitutionType } from './institution.type.entity';

@Injectable()
export class InstitutionTypeService extends TypeOrmCrudService<InstitutionType> {
  constructor(
    @InjectRepository(InstitutionType) repo,
    // @InjectRepository(InstitutionType)
    // private readonly instututionTypeRepository: Repository<InstitutionType>,
  ) {
    super(repo);
  }

  async getInstitutionTypesByUser(
    // filterText: string,
    userId: number,
  ): Promise<any> {
    let filter = '';

    if (userId != 1) {
      if (filter) {
        filter = `${filter}  and user.userTypeId = :userId`;
      } else {
        filter = `user.userTypeId = :userId`;
      }
    }

    const data = this.repo
      .createQueryBuilder('itype')
      .leftJoinAndMapOne(
        'itype.type',
        Institution,
        'ins',
        'itype.id = ins.typeId',
      )
      .leftJoinAndMapOne(
        'ins.user',
        User,
        'user',
        'ins.id = user.institutionId',
      )
      .leftJoinAndMapOne(
        'user.userType',
        UserType,
        'userType',
        'userType.id = user.userTypeId',
      )

      .where(filter, {
        //   filterText: `%${filterText}%`,
        userId,
      })
      .orderBy('ins.createdOn', 'DESC');

    console.log('typequery', data.getQuery());

    // if(data){
    //   // console.log('resula',data)

    // }
    return data;
  }
}
