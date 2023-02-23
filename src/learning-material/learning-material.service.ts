import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Institution } from 'src/institution/institution.entity';
import { Sector } from 'src/master-data/sector/sector.entity';
import { UserType } from 'src/users/user.type.entity';
import { LearningMaterialSector } from './entity/learning-material-sector.entity';
import { LearningMaterialUserType } from './entity/learning-material-usertype.entity';
import { LearningMaterial } from './entity/learning-material.entity';
@Injectable()
export class LearningMaterialService extends TypeOrmCrudService<LearningMaterial> {
  constructor(@InjectRepository(LearningMaterial) repo) {
    super(repo);
  }

  async getlearningmaterialdetails(
    options: IPaginationOptions,
    filterText: string,

    sortOrder: number,
    sortType: number,
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
    institutionIdFromTocken: number,
    userRole: string,
  ): Promise<Pagination<LearningMaterial>> {
    let filter = '';

    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(lm.documentType LIKE :filterText OR lm.documentName LIKE :filterText OR lm.editedOn LIKE :filterText)';
    }

    if (userRole == 'MRV Admin') {
      if (filter) {
        filter = `${filter}  and lmu.userTypeId = 4   `;
      } else {
        filter = `lmu.userTypeId = 4   `;
      }
    } else if (userRole == 'Country Admin') {
      if (filter) {
        filter = `${filter}  and lmu.userTypeId = 1   `;
      } else {
        filter = `lmu.userTypeId = 1   `;
      }
    } else if (userRole == 'Verifier') {
      if (filter) {
        filter = `${filter}  and lmu.userTypeId = 2   `;
      } else {
        filter = `lmu.userTypeId = 2   `;
      }
    } else if (userRole == 'Sector Admin') {
      if (filter) {
        filter = `${filter}  and lmu.userTypeId = 3   `;
      } else {
        filter = `lmu.userTypeId = 3   `;
      }
    } else if (userRole == 'Technical Team') {
      if (filter) {
        filter = `${filter}  and lmu.userTypeId = 5   `;
      } else {
        filter = `lmu.userTypeId = 5   `;
      }
    } else if (userRole == 'Data Collection Team') {
      if (filter) {
        filter = `${filter}  and lmu.userTypeId = 6   `;
      } else {
        filter = `lmu.userTypeId = 6   `;
      }
    } else if (userRole == 'QC Team') {
      if (filter) {
        filter = `${filter}  and lmu.userTypeId = 7   `;
      } else {
        filter = `lmu.userTypeId = 7   `;
      }
    } else if (userRole == 'Institution Admin') {
      if (filter) {
        filter = `${filter}  and lmu.userTypeId = 8   `;
      } else {
        filter = `lmu.userTypeId = 8   `;
      }
    } else if (userRole == 'Data Entry Operator') {
      if (filter) {
        filter = `${filter}  and lmu.userTypeId = 9   `;
      } else {
        filter = `lmu.userTypeId = 9   `;
      }
    }

    const data = this.repo
      .createQueryBuilder('lm')
      .select([
        'lm.documentName',
        'lm.editedOn',
        'lm.document',
        'lm.documentType',
      ])
      .leftJoinAndMapMany(
        'lm.learningMaterialUserType',
        LearningMaterialUserType,
        'lmu',
        'lmu.learningMaterialId = lm.id',
      )

      .leftJoinAndMapMany(
        'lm.learningMaterialSector',
        LearningMaterialSector,
        'lms',
        'lms.learningMaterial2Id = lm.id',
      )

      .where(filter, {
        filterText: `%${filterText}%`,
      })
      .orderBy(
        sortType == 0 ? 'lm.editedOn' : 'lm.documentName',
        sortOrder == 0 ? 'DESC' : 'ASC',
      );

    const resualt = await paginate(data, options);

    if (resualt) {
      return resualt;
    }
  }
}
