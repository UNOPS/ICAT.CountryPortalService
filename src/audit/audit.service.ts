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
        const newaudit = await this.repo.save(newAudit);
      }
    } else {
      const user = await this.userRepo.findOne({
        where: { email: contextUser.username },
      });

      user.updateFullName();

      const newAudit = new Audit();
      newAudit.action = auditDto.action;
      newAudit.actionStatus = auditDto.actionStatus;
      newAudit.comment = auditDto.comment;

      newAudit.user = user;
      newAudit.userName = user.fullName;

      newAudit.userType = contextUser.user.roles[0];
      const newaudit = await this.repo.save(newAudit);
    }
  }
  async createAnonymous(auditDto: AuditDto) {
    const newAudit = new Audit();
    newAudit.action = auditDto.action;
    newAudit.actionStatus = auditDto.actionStatus;
    newAudit.comment = auditDto.comment;

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
  ): Promise<Pagination<Audit>> {
    let filter = '';

    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
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
        filter = `${filter}  and(  dr.editedOn LIKE :editedOn)`;
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
      if (filter) {
        filter = `${filter}  and usr.username = :username`;
      } else {
        filter = `usr.username = :username`;
      }
    } else if ('Sector Admin' == role) {
      if (filter) {
        filter = `${filter}  and dr.userType in ('Sector Admin','MRV Admin','Technical Team','Data Collection Team','QC Team') `;
      } else {
        filter = `dr.userType  in ('Sector Admin','MRV Admin','Technical Team','Data Collection Team','QC Team')`;
      }
    } else if ('MRV Admin' == role) {
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

    const data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapOne('dr.user', User, 'usr', 'usr.id = dr.userId')
      .leftJoinAndMapOne(
        'usr.institution',
        Institution,
        'ins',
        'usr.institutionId = ins.id',
      )

      .where(filter, {
        filterText: `%${filterText}%`,
        userTypeId,
        action,
        editedOn: `%${editedOn}%`,
        username,
        countryIdFromTocken,
        sectorIdFromTocken,
        institutionIdFromTocken,
      })
      .orderBy('dr.createdOn', 'DESC');

    const result = await paginate(data, options);

    if (result) {
      return result;
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
