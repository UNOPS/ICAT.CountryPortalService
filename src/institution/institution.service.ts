import { User } from './../users/user.entity';
import { count, log } from 'console';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Institution } from './institution.entity';

import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { InstitutionCategory } from './institution.category.entity';
import { InstitutionType } from './institution.type.entity';
import { UsersController } from 'src/users/users.controller';
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
    userTypeFromTocken: string
    // status: number,
  ): Promise<Pagination<Institution>> {
    let filter: string = '';

    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(ins.name LIKE :filterText OR ins.address LIKE :filterText OR cate.name LIKE :filterText OR type.name LIKE :filterText OR user.firstName LIKE :filterText OR user.lastName LIKE :filterText)';
      // OR ins.address LIKE :filterText OR cate.name LIKE :filterText OR type.name LIKE :filterText
    }
    console.log('userId', userId);
    console.log('institutionTypeId', institutionTypeId);
    console.log('userTypeFromTocken', userTypeFromTocken);



    // if (userId != 1 && userId !=0) {
    //   if (filter) {
    //     filter = `${filter}  and user.userType = :userId`;
    //   } else {
    //     filter = `user.userType = :userId`;
    //   }
    // }



    if (filterText == 'Activate') {
      console.log('Activate');
      console.log('status....', 0);
      filter = `ins.status = 0`;
      // console.log('filterrrr',filter)
    }

    if (filterText == 'activate') {
      console.log('Activate');

      console.log('status....', 0);
      filter = `ins.status = 0`;
      // console.log('filterrrr',filter)
    }

    if (filterText == 'Deactivate') {
      console.log('Activate');

      console.log('status....', -10);
      filter = `ins.status = -10`;
      // console.log('filterrrr',filter)
    }

    if (filterText == 'deactivate') {
      console.log('Activate');

      console.log('status....', -10);
      filter = `ins.status = -10`;
      // console.log('filterrrr',filter)
    }


    if (countryIdFromTocken != 0) {
      console.log('countryIdFromTocken')

      if (filter) {
        filter = `${filter}  and ins.countryId = :countryIdFromTocken`;
      } else {
        filter = `ins.countryId = :countryIdFromTocken`;
      }
    }

    if (sectorIdFromTocken) {
      console.log('sectorIdFromTocken')
      if (filter) {
        filter = `${filter}  and ins.sectorId = :sectorIdFromTocken`;
      } else {
        filter = `ins.sectorId = :sectorIdFromTocken`;
      }

    }

    if (userTypeFromTocken == "Technical Team") {
      console.log('Technical')

      if (filter) {
        filter = `${filter}  and ins.typeId = 3`;
      } else {
        filter = `ins.typeId = 3)`;
      }
    }

    if (userTypeFromTocken === "Data Collection Team"){
      console.log("Data Collection Team")
      if (filter) {
        filter = `${filter} and user.userTypeId = 9 or user.userTypeId = 8`
      } else {
        filter = `user.userTypeId = 9 or user.userTypeId = 8`
      }
    }

    // if(filter){
    //   filter = `${filter}  and  (user.institutionId is null OR ins.typeId in (1,2,3)
    //   and case ins.typeId WHEN 1 THEN user.userTypeId = 1
    //             WHEN 2 THEN user.userTypeId = 3
    //                   WHEN 3 THEN user.userTypeId = 8
    //        END)`;

    // }else{
    //   filter = ` (user.institutionId is null OR   ins.typeId in (1,2,3)
    //   and case ins.typeId WHEN 1 THEN user.userTypeId = 1
    //             WHEN 2 THEN user.userTypeId = 3
    //                   WHEN 3 THEN user.userTypeId = 8
    //        END)`; 

    // }

    let data = this.repo
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

        // userId,
        countryIdFromTocken,
        sectorIdFromTocken,
        //status
      })
      .orderBy('ins.status', 'ASC')
      .groupBy('ins.id');
    // .addOrderBy('ins.createdOn','DESC')
    // console.log('data........',data)
    // console.log('data////////',data)
    //     let user: User = new User();

    // console.log('query',data.getQuery());

    let resualt = await paginate(data, options);
    console.log('resula====', resualt);
    if (resualt) {
      // console.log('resula',resualt)
      return resualt;
    }
  }

  async getInsDetails(
    filterText: string,
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
    userTypeFromTocken: string
    // status: number,
  ) {
    console.log('==========', countryIdFromTocken, " ", sectorIdFromTocken, " ", userTypeFromTocken);
    let filter: string = '';

    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(ins.name LIKE :filterText )';
      // OR ins.address LIKE :filterText OR cate.name LIKE :filterText OR type.name LIKE :filterText
    }
    let cou = await this.countryRepository.findOne({ id: countryIdFromTocken });
    let num = await this.repo.find({ name: filterText, country: cou })
    return num;
  }


  async getInstitutionForUsers(

    inside: number,
    userType: number
  ): Promise<any> {
    let filter: string = '';


    let data = this.repo
      .createQueryBuilder('ins')
      .select(['ins.id', 'user.id'])
      .leftJoinAndMapMany(
        'ins.user',
        User,
        'user',
        'ins.id = user.institutionId ',
      )
      .where('ins.id = :inside and user.userTypeId = :userType', {
        inside, userType
      })



    let resualt = await data.getCount();
    console.log('resula====', resualt);
    if (resualt) {

      return resualt;
    }
  }

  async getInstitutionforAssesment(
    countryIdFromTocken: number,
  ): Promise<Institution[]> {


    let data = this.repo
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
    // .addOrderBy('ins.createdOn','DESC')
    // console.log('data........',data)
    // console.log('data////////',data)
    //     let user: User = new User();

    // console.log('query',data.getQuery());

    let resualt = await data.getMany();

    if (resualt) {
      // console.log('resula',resualt)
      return resualt;
    }
  }

  async getInstitutionforApproveData(
    countryIdFromTocken: number,
    sectorIdFromTocken: number
  ): Promise<Institution[]> {


    let data = this.repo
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
      .where('type.id = 3' + (sectorIdFromTocken != 0 ? ` and ins.sectorId = ${sectorIdFromTocken}` : ''))
      .orderBy('ins.name', 'ASC');
    // .addOrderBy('ins.createdOn','DESC')
    // console.log('data........',data)
    // console.log('data////////',data)
    //     let user: User = new User();

    // console.log('query',data.getQuery());

    let resualt = await data.getMany();

    if (resualt) {
      // console.log('resula',resualt)
      return resualt;
    }
  }



  async getInstitutionForManageUsers(

    options: IPaginationOptions,
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
    institutionIdFromTocken: number,
    role: string
  ) {


    let filter: string = '';




    if (countryIdFromTocken != 0) {
      console.log('countryIdFromTocken', countryIdFromTocken)

      if (filter) {
        console.log('kkkkkkkkkkkkkkkkkk')

        filter = `${filter}  and ins.countryId = :countryIdFromTocken`;
      } else {
        console.log('yyyyyyyyyyyyyyyyy')

        filter = `ins.countryId = :countryIdFromTocken`;
      }
    }

    if (sectorIdFromTocken) {
      console.log('sectorIdFromTocken')
      if (filter) {
        filter = `${filter}  and ins.sectorId = :sectorIdFromTocken`;
      } else {
        filter = `ins.sectorId = :sectorIdFromTocken`;
      }

    }

    if (institutionIdFromTocken) {
      console.log('institutionIdFromTocken')
      if (filter) {
        filter = `${filter}  and ins.id = :institutionIdFromTocken`;
      } else {
        filter = `ins.id = :institutionIdFromTocken`;
      }

    }


    if (role == "Country Admin") {

    }
    else if (role == "Sector Admin") {
      console.log("Sector Admin")
      if (filter) {
        filter = `${filter}  and ins.typeId not in (1)`;
      } else {
        filter = `ins.typeId not in (1) `;
      }
    }
    else if (role == "MRV Admin") {
      console.log("MRV Admin")
      if (filter) {
        filter = `${filter}  and ins.typeId not in (1,2)`;
      } else {
        filter = `ins.typeId not in (1,2) `;
      }
    }
    else if (role == "Technical Team" || role == "Data Collection Team" || role == "QC Team") {
      console.log("Technical Team")
      if (filter) {
        filter = `${filter}  and ins.typeId = 3 `;
      } else {
        filter = `ins.typeId = 3 `;
      }
    }

    else {


    }

    let data = this.repo
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
        institutionIdFromTocken

      })
      .orderBy('ins.status', 'ASC');



    let resualt = await paginate(data, options);
    // console.log("data====",data.execute())
    console.log('resula======', resualt);
    if (resualt) {
      // console.log('resula',resualt)
      return resualt;
    }

  }




}
