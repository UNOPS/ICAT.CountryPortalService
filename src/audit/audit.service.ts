import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Institution } from 'src/institution/institution.entity';
import { User } from 'src/users/user.entity';
import { UserType } from 'src/users/user.type.entity';
import { Repository } from 'typeorm';
import { AuditDto } from './dto/audit-dto';
import { Audit } from './entity/audit.entity';

@Injectable()
export class AuditService extends TypeOrmCrudService<Audit> {
  constructor(
    @InjectRepository(Audit) repo,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @Inject(REQUEST) private request,
  ) {
    super(repo);
  }

  async create(auditDto: AuditDto) {
    const contextUser = this.request.user;
    if (!contextUser) {
      const user = await this.userRepo.findOne({
        where: { email: auditDto.userName },
      });
      if (user != undefined) {
        user.updateFullName();
        const newAudit = new Audit();
        newAudit.action = auditDto.action;
        newAudit.actionStatus = auditDto.actionStatus;
        newAudit.comment = auditDto.comment;
        newAudit.user = user;
        newAudit.userName = user.fullName;
        newAudit.userType = user.userType.name;
        var newaudit = await this.repo.save(newAudit);
      }
      // console.log('user',user)
    } else {
      // console.log('============contextUser========', contextUser);
      //To-do get user from context
      const user = await this.userRepo.findOne({
        where: { email: contextUser.username },
      });

      user.updateFullName();

      const newAudit = new Audit();
      newAudit.action = auditDto.action;
      newAudit.actionStatus = auditDto.actionStatus;
      newAudit.comment = auditDto.comment;
      // newAudit.createdBy = auditDto.createdBy;
      // newAudit.createdOn = auditDto.createdOn;
      // newAudit.editedBy = auditDto.editedBy;
      // newAudit.editedOn = auditDto.editedOn;
      // newAudit.id = auditDto.id;
      // newAudit.status= auditDto.status;
      newAudit.user = user;
      newAudit.userName = user.fullName;

      newAudit.userType = contextUser.user.roles[0];
      var newaudit = await this.repo.save(newAudit);
    }
  }
  async createAnonymous(auditDto: AuditDto) {
    // console.log('user',user)

    const newAudit = new Audit();
    newAudit.action = auditDto.action;
    newAudit.actionStatus = auditDto.actionStatus;
    newAudit.comment = auditDto.comment;
    // newAudit.createdBy = auditDto.createdBy;
    // newAudit.createdOn = auditDto.createdOn;
    // newAudit.editedBy = auditDto.editedBy;
    // newAudit.editedOn = auditDto.editedOn;
    // newAudit.id = auditDto.id;
    // newAudit.status= auditDto.status;
    // let user:User=new User()
    // user.id=0;
    // newAudit.user = user;
    newAudit.userName = 'anonymous';

    newAudit.userType = 'anonymous';
    const newaudit = await this.repo.save(newAudit);
  }

  async getAuditDetails(
    options: IPaginationOptions,
    filterText: string,
    userTypeId: string,
    action: string,
    editedOn: string,
    role: string,
    username: string,
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
    institutionIdFromTocken: number,
    // institutionId:number
  ): Promise<Pagination<Audit>> {
    let filter = '';
    // let fDate = `${editedOn.getFullYear()}-${editedOn.getMonth()+1}-${editedOn.getDate()}`;

    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        // '(dr.climateActionName LIKE :filterText OR dr.description LIKE :filterText)';
        '(dr.userName LIKE :filterText OR dr.action LIKE :filterText OR dr.actionStatus LIKE :filterText OR dr.editedOn LIKE :filterText)';
    }

    if (userTypeId != null && userTypeId != undefined && userTypeId != '') {
      if (filter) {
        filter = `${filter}  and dr.userType= :userTypeId`;
      } else {
        filter = `dr.userType = :userTypeId`;
      }
    }
    if (editedOn != null && editedOn != undefined && editedOn != '') {
      if (filter) {
        filter =
          // '(dr.climateActionName LIKE :filterText OR dr.description LIKE :filterText)';
          `${filter}  and(  dr.editedOn LIKE :editedOn)`;
      } else filter = '( dr.editedOn LIKE :editedOn)';
    }

    if (action != null && action != undefined && action != '') {
      if (filter) {
        filter = `${filter}  and dr.actionStatus = :action`;
      } else {
        filter = `dr.actionStatus = :action`;
      }
    }

    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and usr.countryId= :countryIdFromTocken`;
      } else {
        filter = `usr.countryId = :countryIdFromTocken`;
      }
    }
    if (sectorIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and ins.sectorId =:sectorIdFromTocken`;
      } else {
        filter = `ins.sectorId =:sectorIdFromTocken`;
      }
    }
    if (institutionIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and usr.institutionId =:institutionIdFromTocken`;
      } else {
        filter = `usr.institutionId =:institutionIdFromTocken`;
      }
    }

    if (['Country Admin', 'Verifier', 'Data Entry Operator'].includes(role)) {
      console.log('Country Admin', 'Verifier', 'Data Entry Operator');
      if (filter) {
        filter = `${filter}  and usr.username = :username`;
      } else {
        filter = `usr.username = :username`;
      }
    } else if ('Sector Admin' == role) {
      console.log('Sector Admin');
      if (filter) {
        filter = `${filter}  and dr.userType in ('Sector Admin','MRV Admin','Technical Team','Data Collection Team','QC Team') `;
      } else {
        filter = `dr.userType  in ('Sector Admin','MRV Admin','Technical Team','Data Collection Team','QC Team')`;
      }
    } else if ('MRV Admin' == role) {
      console.log('MRV Admin');
      if (filter) {
        filter = `${filter}  and dr.userType in ('MRV Admin','Technical Team','Data Collection Team','QC Team') `;
      } else {
        filter = `dr.userType  in ('MRV Admin','Technical Team','Data Collection Team','QC Team')`;
      }
    } else if (
      ['Technical Team', 'Data Collection Team', 'QC Team'].includes(role)
    ) {
      if (filter) {
        filter = `${filter}  and dr.userType in ('Technical Team','Data Collection Team','QC Team') `;
      } else {
        filter = `dr.userType  in ('Technical Team','Data Collection Team','QC Team')`;
      }
    }

    // if (editedOn != null && editedOn != undefined && editedOn != '') {
    //     if (filter) {
    //      let editdate = `dr.editedOn`;
    //      console.log('mmm','dr.editedOn')
    //       filter = `${filter}  and (dr.editedOn LIKE :editedOn)`;
    //     } else {
    //       filter = `dr.editedOn = :editedOn`;
    //     }
    //   }

    // if (institutionId != null && institutionId != undefined  ) {
    //   if (filter) {
    //     filter = `${filter}  and usr.institutionId= :institutionId`;
    //   } else {
    //     filter = `usr.institutionId = :institutionId`;
    //   }
    // }

    const data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapOne('dr.user', User, 'usr', 'usr.id = dr.userId')
      .leftJoinAndMapOne(
        'usr.institution',
        Institution,
        'ins',
        'usr.institutionId = ins.id',
      )
      // .innerJoinAndMapOne('dr.country', Country, 'coun', 'dr.countryId = coun.id')

      .where(filter, {
        filterText: `%${filterText}%`,
        userTypeId,
        action,
        editedOn: `%${editedOn}%`,
        username,
        countryIdFromTocken,
        sectorIdFromTocken,
        institutionIdFromTocken,
        // institutionId
      })
      .orderBy('dr.createdOn', 'DESC');
    // console.log(
    //   '=====================================================================',
    // );

    const resualt = await paginate(data, options);
    console.log(`resualt`, resualt);
    if (resualt) {
      return resualt;
    }
  }

  async userCount(countryId: number) {
    const data = this.repo
      .createQueryBuilder('au')
      .innerJoinAndMapOne(
        'au.userType',
        UserType,
        'usertp',
        'usertp.name = au.userType',
      )
      .innerJoinAndMapOne(
        'au.user',
        User,
        'user',
        `user.id = au.userId ${
          countryId != 0 ? ' and user.countryId =' + countryId : ''
        } `,
      )
      .select(['COUNT(au.userType) as data', 'au.userType'])
      .groupBy('au.userType')
      .where('au.actionStatus ="Log In"');
    return data.execute();
  }
}
