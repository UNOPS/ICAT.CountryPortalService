import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InstitutionType } from 'src/institution/institution.type.entity';
import { UserType } from 'src/users/user.type.entity';

@Injectable()
export class UserTypeService extends TypeOrmCrudService<UserType> {
  constructor(@InjectRepository(UserType) repo) {
    super(repo);
  }

  async GetUserTypes(): Promise<UserType[]> {
    const data = this.repo
      .createQueryBuilder('ae')
      .leftJoinAndMapMany(
        'ae.institutionType',
        'instype_usertype',
        'int',
        'int.userTypeId = ae.id',
      )

      .orderBy('ae.createdOn', 'DESC');
    // console.log(
    //   '=====================================================================',
    // );
    //console.log(data.getQuery());

    const resualt = data.getRawMany();

    if (resualt) {
      return resualt;
    }
  }
}
