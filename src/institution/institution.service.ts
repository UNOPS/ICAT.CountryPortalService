import { User } from './../users/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Institution } from './institution.entity';

import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { InstitutionCategory } from './institution.category.entity';
import { InstitutionType } from './institution.type.entity';
import { UsersService } from 'src/users/users.service';
import { UserType } from 'src/users/user.type.entity';
import { Country } from 'src/country/entity/country.entity';

@Injectable()
export class InstitutionService extends TypeOrmCrudService<Institution> {
  constructor(
    @InjectRepository(Institution) repo,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(User)
    private readonly userService: UsersService,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {
    super(repo);
  }

  async softDelete(id: number) {
    this.repo.softDelete({ id });
    return;
  }

  async getInstitutionDetails(
    options: IPaginationOptions,
    filterText: string,
    userId: number,
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
    institutionTypeId: number,
    userTypeFromTocken: string,
  ): Promise<Pagination<Institution>> {
    let filter = '';

    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(ins.name LIKE :filterText OR ins.address LIKE :filterText OR cate.name LIKE :filterText OR type.name LIKE :filterText OR user.firstName LIKE :filterText OR user.lastName LIKE :filterText)';
    }

    if (filterText == 'Activate') {
      filter = `ins.status = 0`;
    }

    if (filterText == 'activate') {
      filter = `ins.status = 0`;
    }

    if (filterText == 'Deactivate') {
      filter = `ins.status = -10`;
    }

    if (filterText == 'deactivate') {
      filter = `ins.status = -10`;
    }

    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and country.id = :countryIdFromTocken`;
      } else {
        filter = `country.id = :countryIdFromTocken`;
      }
    }

    if (sectorIdFromTocken) {
      if (filter) {
        filter = `${filter}  and ins.sectorId = :sectorIdFromTocken`;
      } else {
        filter = `ins.sectorId = :sectorIdFromTocken`;
      }
    }

    if (userTypeFromTocken == 'Technical Team') {
      if (filter) {
        filter = `${filter}  and ins.typeId = 3`;
      } else {
        filter = `ins.typeId = 3)`;
      }
    }

    if (userTypeFromTocken === "Data Collection Team"){
      if (filter) {
        filter = `${filter} and (user.userTypeId = 9 or user.userTypeId = 8)`
      } else {
        filter = `(user.userTypeId = 9 or user.userTypeId = 8)`
      }
    }

    let data = this.repo
      .createQueryBuilder('ins')
      .leftJoinAndMapOne(
        'ins.country',
        Country,
        'country',
        'country.id = ins.countryId'
      )
      .leftJoinAndMapOne(
        'ins.category',
        InstitutionCategory,
        'cate',
        'cate.id = ins.categoryId',
      )
      .leftJoinAndMapOne(
        'ins.type',
        InstitutionType,
        'type',
        'type.id = ins.typeId',
      )
      .leftJoinAndMapMany(
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
        filterText: `%${filterText}%`,
        countryIdFromTocken,
        sectorIdFromTocken,
      })
      .orderBy('ins.status', 'ASC')
      .groupBy('ins.id');

    const result = await paginate(data, options);

    if (result) {
      return result;
    }
  }

  async getInsDetails(
    filterText: string,
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
    userTypeFromTocken: string,
  ) {
    let filter = '';

    if (filterText != null && filterText != undefined && filterText != '') {
      filter = '(ins.name LIKE :filterText )';
    }
    const cou = await this.countryRepository.findOne({
      id: countryIdFromTocken,
    });
    const num = await this.repo.find({ name: filterText, country: cou });
    return num;
  }

  async getInstitutionForUsers(inside: number, userType: number): Promise<any> {
    const data = this.repo
      .createQueryBuilder('ins')
      .select(['ins.id', 'user.id'])
      .leftJoinAndMapMany(
        'ins.user',
        User,
        'user',
        'ins.id = user.institutionId ',
      )
      .where('ins.id = :inside and user.userTypeId = :userType', {
        inside,
        userType,
      });

    const result = await data.getCount();

    if (result) {
      return result;
    }
  }

  async getInstitutionforAssessment(
    countryIdFromTocken: number,
  ): Promise<Institution[]> {
    const data = this.repo
      .createQueryBuilder('ins')
      .leftJoinAndMapOne(
        'ins.type',
        InstitutionType,
        'type',
        'type.id = ins.typeId',
      )
      .innerJoinAndMapOne(
        'ins.country',
        Country,
        'cou',
        `ins.countryId = cou.id and cou.id = ${countryIdFromTocken}`,
      )
      .where('type.id = 3')
      .orderBy('ins.name', 'ASC');

    const result = await data.getMany();

    if (result) {
      return result;
    }
  }

  async getInstitutionforApproveData(
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
  ): Promise<Institution[]> {
    const data = this.repo
      .createQueryBuilder('ins')
      .leftJoinAndMapOne(
        'ins.type',
        InstitutionType,
        'type',
        'type.id = ins.typeId',
      )
      .innerJoinAndMapOne(
        'ins.country',
        Country,
        'cou',
        `ins.countryId = cou.id and cou.id = ${countryIdFromTocken}`,
      )
      .where(
        'type.id = 3' +
          (sectorIdFromTocken != 0
            ? ` and ins.sectorId = ${sectorIdFromTocken}`
            : ''),
      )
      .orderBy('ins.name', 'ASC');

    const result = await data.getMany();

    if (result) {
      return result;
    }
  }

  async getInstitutionForManageUsers(
    options: IPaginationOptions,
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
    institutionIdFromTocken: number,
    role: string,
  ) {
    let filter = '';

    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and ins.countryId = :countryIdFromTocken`;
      } else {
        filter = `ins.countryId = :countryIdFromTocken`;
      }
    }

    if (sectorIdFromTocken) {
      if (filter) {
        filter = `${filter}  and ins.sectorId = :sectorIdFromTocken`;
      } else {
        filter = `ins.sectorId = :sectorIdFromTocken`;
      }
    }

    if (institutionIdFromTocken) {
      if (filter) {
        filter = `${filter}  and ins.id = :institutionIdFromTocken`;
      } else {
        filter = `ins.id = :institutionIdFromTocken`;
      }
    }

    if (role == 'Country Admin') {
    } else if (role == 'Sector Admin') {
      if (filter) {
        filter = `${filter}  and ins.typeId not in (1)`;
      } else {
        filter = `ins.typeId not in (1) `;
      }
    } else if (role == 'MRV Admin') {
      if (filter) {
        filter = `${filter}  and ins.typeId not in (1,2)`;
      } else {
        filter = `ins.typeId not in (1,2) `;
      }
    } else if (
      role == 'Technical Team' ||
      role == 'Data Collection Team' ||
      role == 'QC Team'
    ) {
      if (filter) {
        filter = `${filter}  and ins.typeId = 3 `;
      } else {
        filter = `ins.typeId = 3 `;
      }
    } else {
    }

    const data = this.repo
      .createQueryBuilder('ins')
      .leftJoinAndMapOne(
        'ins.category',
        InstitutionCategory,
        'cate',
        'cate.id = ins.categoryId',
      )
      .leftJoinAndMapOne(
        'ins.type',
        InstitutionType,
        'type',
        'type.id = ins.typeId',
      )

      .where(filter, {
        countryIdFromTocken,
        sectorIdFromTocken,
        institutionIdFromTocken,
      })
      .andWhere('ins.status = 0')
      .orderBy('ins.status', 'ASC');

    const result = await paginate(data, options);

    if (result) {
      return result;
    }
  }
}
