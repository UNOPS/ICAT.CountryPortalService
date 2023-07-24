import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { AssessmentResult } from 'src/assessment-result/entity/assessment-result.entity';
import { AssessmentYear } from 'src/assessment-year/entity/assessment-year.entity';
import { AuditService } from 'src/audit/audit.service';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { Institution } from 'src/institution/institution.entity';
import { Ndc } from 'src/master-data/ndc/ndc.entity';
import { SubNdc } from 'src/master-data/ndc/sub-ndc.entity';
import { Methodology } from 'src/methodology/entity/methodology.entity';
import { Parameter } from 'src/parameter/entity/parameter.entity';
import { Project } from 'src/project/entity/project.entity';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Assessment } from './entity/assessment.entity';

@Injectable()
export class AssessmentService extends TypeOrmCrudService<Assessment> {
  constructor(
    @InjectRepository(Assessment) repo,
    private readonly userService: UsersService,
    private readonly auditService: AuditService,
    @InjectRepository(Methodology)
    public methodologyRepo: Repository<Methodology>,
  ) {
    super(repo);
  }

  async methodologyUseCount(country: number) {
    let data;
    if (country != 0) {
      data = this.repo
        .createQueryBuilder('asse')
        .innerJoinAndMapOne(
          'asse.methodology',
          Methodology,
          'meth',
          `meth.id = asse.methodologyId and meth.countryId = ${country} `,
        )
        .select([
          'COUNT(asse.methodologyId) as data',
          'meth.displayName as name',
        ])
        .groupBy('asse.methodologyId');
    } else {
      data = this.repo
        .createQueryBuilder('asse')
        .innerJoinAndMapOne(
          'asse.methodology',
          Methodology,
          'meth',
          'meth.id = asse.methodologyId and asse.methodologyId IS NOT NULL',
        )
        .select([
          'COUNT(asse.methodologyId) as data',
          'meth.displayName as name',
        ])
        .groupBy('asse.methodologyId');
    }
    return data.execute();
  }

  async assessmentForManageDataStatus(
    options: IPaginationOptions,
    filterText: string,
    projectStatusId: number,
    projectApprovalStatusId: number,
    countryId: number,
    sectorId: number,
    isProposal: number,
  ): Promise<any> {
    let filter = '';
    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(proj.climateActionName LIKE :filterText OR asse.assessmentType LIKE :filterText OR assesYr.assessmentYear LIKE :filterText)';
    }
    if (isProposal != undefined) {
      if (filter) {
        filter = `${filter}  and asse.isProposal = :isProposal`;
      } else {
        filter = ` asse.isProposal = :isProposal`;
      }
    }

    if (projectStatusId != 0) {
      if (filter) {
        filter = `${filter}  and proj.projectStatusId = :projectStatusId`;
      } else {
        filter = ` proj.projectStatusId = :projectStatusId`;
      }
    }

    if (projectApprovalStatusId != 0) {
      if (filter) {
        filter = `${filter}  and proj.projectApprovalStatusId = :projectApprovalStatusId`;
      } else {
        filter = `proj.projectApprovalStatusId = :projectApprovalStatusId`;
      }
    }
    if (countryId != 0) {
      if (filter) {
        filter = `${filter}  and proj.countryId = :countryId`;
      } else {
        filter = `proj.countryId = :countryId`;
      }
    }

    if (sectorId != 0) {
      if (filter) {
        filter = `${filter}  and proj.sectorId = :sectorId`;
      } else {
        filter = `proj.sectorId = :sectorId`;
      }
    }
    const data = this.repo
      .createQueryBuilder('asse')

      .leftJoinAndMapOne(
        'asse.project',
        Project,
        'proj',
        'proj.id = asse.projectId',
      )
      .leftJoinAndMapMany(
        'asse.assessmentYear',
        AssessmentYear,
        'assesYr',
        'assesYr.assessmentId = asse.id',
      )
      .select([
        'asse.id',
        'assesYr.id',
        'assesYr.assessmentYear',
        'asse.assessmentType',
        'proj.climateActionName',
      ])
      .where(filter, {
        filterText: `%${filterText}%`,
        isProposal,
        projectStatusId,
        projectApprovalStatusId,
        countryId,
        sectorId,
      })
      .orderBy('asse.createdOn', 'ASC');
    const result = await paginate(data, options);
    if (result) {
      return result;
    }
  }
  async assessmentForMAC(projectId: number): Promise<any> {
    let filter = '';
    if (filter) {
      filter = `${filter}  and asse.assessmentType in ('Ex-post','Ex-ante')`;
    } else {
      filter = `asse.assessmentType  in ('Ex-post','Ex-ante')`;
    }

    if (filter) {
      filter = `${filter}  and asse.isProposal = 0`;
    } else {
      filter = `asse.isProposal = 0`;
    }

    if (projectId != 0) {
      if (filter) {
        filter = `${filter}  and pt.id = :projectId`;
      } else {
        filter = `pt.id = :projectId`;
      }
    }

    const data = this.repo
      .createQueryBuilder('asse')
      .leftJoinAndMapOne(
        'asse.project',
        Project,
        'pt',
        'pt.id = asse.projectId',
      )
      .leftJoinAndMapMany(
        'asse.assessmentYear',
        AssessmentYear,
        'ay',
        'ay.assessmentId = asse.id',
      )
      .where(filter, {
        projectId,
      });

    const result = await data.execute();

    if (result) {
      return result;
    }
  }

  async getassessmentsdetails(
    options: IPaginationOptions,
    filterText: string,
    assessmentType: string,
    isProposal: number,
    projectId: number,
    ctAction: string,
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
  ): Promise<Pagination<Assessment>> {
    let filter = '';

    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(ay.assessmentYear LIKE :filterText OR asse.emmisionReductionValue LIKE :filterText OR asse.macValue LIKE :filterText OR pt.contactPersoFullName LIKE :filterText OR asse.assessmentStatus LIKE :filterText OR asse.assessmentType LIKE :filterText OR asse.editedOn LIKE :filterText OR us.firstName LIKE :filterText OR us.lastName LIKE :filterText OR mt.name LIKE :filterText OR pt.climateActionName LIKE :filterText)';
    }

    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and pt.countryId = :countryIdFromTocken`;
      } else {
        filter = `pt.countryId = :countryIdFromTocken`;
      }
    }
    if (sectorIdFromTocken) {
      if (filter) {
        filter = `${filter}  and pt.sectorId = :sectorIdFromTocken`;
      } else {
        filter = `pt.sectorId = :sectorIdFromTocken`;
      }
    }

    if (
      assessmentType != null &&
      assessmentType != undefined &&
      assessmentType != ''
    ) {
      if (filter) {
        filter = `${filter}  and asse.assessmentType = :assessmentType`;
      } else {
        filter = `asse.assessmentType = :assessmentType`;
      }
    }

    if (isProposal != null && isProposal != undefined) {
      if (filter) {
        filter = `${filter}  and asse.isProposal = :isProposal`;
      } else {
        filter = `asse.isProposal = :isProposal`;
      }
    }

    if (ctAction != null && ctAction != undefined && ctAction != '') {
      if (filter) {
        filter = `${filter}  and pt.climateActionName = :ctAction`;
      } else {
        filter = `pt.climateActionName = :ctAction`;
      }
    }

    if (projectId != 0) {
      if (filter) {
        filter = `${filter}  and pt.id = :projectId`;
      } else {
        filter = `pt.id = :projectId`;
      }
    }

    const data = this.repo
      .createQueryBuilder('asse')
      .leftJoinAndMapOne(
        'asse.project',
        Project,
        'pt',
        'pt.id = asse.projectId',
      )
      .leftJoinAndMapOne(
        'asse.assessmentResult',
        AssessmentResult,
        'ar',
        'ar.assessmentId = asse.id',
      )
      .leftJoinAndMapMany(
        'asse.assessmentYear',
        AssessmentYear,
        'ay',
        'ay.assessmentId = asse.id',
      )
      .leftJoinAndMapOne('asse.user', User, 'us', 'asse.userId = us.id')
      .leftJoinAndMapOne(
        'asse.methodology',
        Methodology,
        'mt',
        'mt.id = asse.methodologyId',
      )

      .where(filter, {
        filterText: `%${filterText}%`,
        assessmentType,
        isProposal,
        projectId,
        ctAction,
        countryIdFromTocken,
        sectorIdFromTocken,
      })

      .orderBy(
        `(case when asse.assessmentStatus = 2 then 1 when asse.assessmentStatus = 1 then 2 end)`,
        'DESC',
      )
      .addOrderBy('asse.editedOn', 'DESC');

    const result = await paginate(data, options);

    if (result) {
      return result;
    }
  }


  async getassessmentsdetailsForResult(
    options: IPaginationOptions,
    filterText: string,
    assessmentType: string,
    isProposal: number,
    projectId: number,
    ctAction: string,
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
  ): Promise<Pagination<Assessment>> {
    console.log('im in.aaa...');
    let filter: string = '';

    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(ay.assessmentYear LIKE :filterText OR asse.emmisionReductionValue LIKE :filterText OR asse.macValue LIKE :filterText OR pt.contactPersoFullName LIKE :filterText OR asse.assessmentStatus LIKE :filterText OR asse.assessmentType LIKE :filterText OR asse.editedOn LIKE :filterText OR us.firstName LIKE :filterText OR us.lastName LIKE :filterText OR mt.name LIKE :filterText OR pt.climateActionName LIKE :filterText)';
    }

    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and pt.countryId = :countryIdFromTocken`;
      } else {
        filter = `pt.countryId = :countryIdFromTocken`;
      }
    }

    console.log('sectorIdFromTocken..', sectorIdFromTocken);
    if (sectorIdFromTocken) {
      if (filter) {
        filter = `${filter}  and pt.sectorId = :sectorIdFromTocken`;
      } else {
        filter = `pt.sectorId = :sectorIdFromTocken`;
      }
    }

    if (
      assessmentType != null &&
      assessmentType != undefined &&
      assessmentType != ''
    ) {
      if (filter) {
        filter = `${filter}  and asse.assessmentType = :assessmentType`;
      } else {
        filter = `asse.assessmentType = :assessmentType`;
      }
    }

    if (isProposal != null && isProposal != undefined) {
      //console.log(isProposal);
      if (filter) {
        filter = `${filter}  and asse.isProposal = :isProposal`;
      } else {
        filter = `asse.isProposal = :isProposal`;
      }
    }

    if (ctAction != null && ctAction != undefined && ctAction != '') {
      //console.log(Active);
      if (filter) {
        filter = `${filter}  and pt.climateActionName = :ctAction`;
      } else {
        filter = `pt.climateActionName = :ctAction`;
      }
    }

    if (projectId != 0) {
      if (filter) {
        filter = `${filter}  and pt.id = :projectId`;
      } else {
        filter = `pt.id = :projectId`;
      }
    }

    // let ltype = 'ASC';

    var data = this.repo
      .createQueryBuilder('asse')
      .leftJoinAndMapOne(
        'asse.project',
        Project,
        'pt',
        'pt.id = asse.projectId',
      )
      .innerJoinAndMapOne(
        'asse.assessmentResult',
        AssessmentResault,
        'ar',
        'ar.assementId = asse.id AND  ar.totalEmission is not null',
      )
      .leftJoinAndMapMany(
        'asse.assessmentYear',
        AssessmentYear,
        'ay',
        'ay.assessmentId = asse.id',
      )
      .leftJoinAndMapOne('asse.user', User, 'us', 'asse.userId = us.id')
      .leftJoinAndMapOne(
        'asse.methodology',
        Methodology,
        'mt',
        'mt.id = asse.methodologyId',
      )

      .where(filter, {
        filterText: `%${filterText}%`,
        assessmentType,
        isProposal,
        projectId,
        ctAction,
        countryIdFromTocken,
        sectorIdFromTocken,
      })
      // .orderBy('asse.editedOn', 'DESC');
      .orderBy(
        `(case when asse.assessmentStatus = 2 then 1 when asse.assessmentStatus = 1 then 2 end)`,
        'DESC',
      )
      .addOrderBy('asse.editedOn', 'DESC');

    let resualt = await paginate(data, options);

    if (resualt) {
      console.log("+++++++++", resualt)
      return resualt;
      
    }
  }

  async getAssessmentData(
    options: IPaginationOptions,
    assessmentYear: string[],
  ): Promise<any> {
    const arr = [];
    const filter = '';
    const data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapMany(
        'dr',
        AssessmentYear,
        'ass',
        'ass.assessmentId = dr.id',
      )
      .where(filter, assessmentYear);

    arr.push(data);

    const result = await paginate(data, options);

    if (result) {
      return result;
    }
  }

  async getAssessmentDetails(
    assessmentId: number,
    assessmentYear: string,
  ): Promise<any> {
    const filter = 'as.id = :assessmentId';

    const data = this.repo
      .createQueryBuilder('as')
      .leftJoinAndMapMany(
        'as.parameters',
        Parameter,
        'pa',
        'as.id = pa.assessmentId and (pa.AssessmentYear = :assessmentYear or pa.isProjection)',
      )
      .leftJoinAndMapOne(
        'pa.institution',
        Institution,
        'in',
        'in.id = pa.institutionId',
      )
      .leftJoinAndMapOne(
        'pa.parameterRequest',
        ParameterRequest,
        'par',
        'par.ParameterId = pa.id',
      )
      .leftJoinAndMapOne('as.ndc', Ndc, 'ndc', 'ndc.id = as.ndcId')
      .leftJoinAndMapOne('as.subNdc', SubNdc, 'sndc', 'sndc.id = as.subNdcId')
      .leftJoinAndMapOne(
        'as.methodology',
        Methodology,
        'me',
        'me.id = as.methodologyId',
      )
      .leftJoinAndMapOne('as.project', Project, 'pr', 'pr.id = as.projectId')
      .leftJoinAndMapOne('pr.ndc', Ndc, 'prndc', 'prndc.id = pr.ndcId')
      .leftJoinAndMapOne(
        'pr.subNdc',
        SubNdc,
        'prsndc',
        'prsndc.id = pr.subNdcId',
      )

      .where(filter, {
        assessmentId,
        assessmentYear,
      });

    return await data.getOne();
  }
  async getAssessmentDetailsForQC(
    assessmentId: number,
    assessmentYear: string,
  ): Promise<any> {
    const filter = 'as.id = :assessmentId';
    const data = this.repo
      .createQueryBuilder('as')
      .leftJoinAndMapMany(
        'as.parameters',
        Parameter,
        'pa',
        `as.id = pa.assessmentId and COALESCE(pa.AssessmentYear ,pa.projectionBaseYear ) = ${assessmentYear} and ((pa.isEnabledAlternative = true AND pa.isAlternative = true) OR (pa.isEnabledAlternative = false AND pa.isAlternative = false ))`,
      )
      .leftJoinAndMapOne(
        'pa.institution',
        Institution,
        'in',
        'in.id = pa.institutionId',
      )
      .leftJoinAndMapOne(
        'pa.parameterRequest',
        ParameterRequest,
        'par',
        'par.ParameterId = pa.id',
      )
      .leftJoinAndMapOne('as.ndc', Ndc, 'ndc', 'ndc.id = as.ndcId')
      .leftJoinAndMapOne('as.subNdc', SubNdc, 'sndc', 'sndc.id = as.subNdcId')
      .leftJoinAndMapOne(
        'as.methodology',
        Methodology,
        'me',
        'me.id = as.methodologyId',
      )
      .leftJoinAndMapOne('as.project', Project, 'pr', 'pr.id = as.projectId')
      .leftJoinAndMapOne('pr.ndc', Ndc, 'prndc', 'prndc.id = pr.ndcId')
      .leftJoinAndMapOne(
        'pr.subNdc',
        SubNdc,
        'prsndc',
        'prsndc.id = pr.subNdcId',
      )

      .where(filter, {
        assessmentId,
        assessmentYear,
      });

    return await data.getOne();
  }

  async checkAssessmentReadyForQC(
    assessmentId: number,
    assessmenYear: number,
  ): Promise<boolean> {
    const data = this.repo
      .createQueryBuilder('as')
      .innerJoinAndMapMany(
        'as.parameters',
        Parameter,
        'para',
        'as.id = para.assessmentId',
      )
      .innerJoinAndMapMany(
        'para.parameterRequest',
        ParameterRequest,
        'par',
        'par.ParameterId = para.id',
      )
      .where(
        'par.UserDataEntry is not null AND as.id =' +
          assessmentId.toString() +
          ' AND (para.projectionBaseYear = ' +
          assessmenYear.toString() +
          ' OR  para.AssessmentYear = ' +
          assessmenYear.toString() +
          ')',
      );

    const totalRecordsAllStatus: any[] = await data.execute();
    const data2 = this.repo
      .createQueryBuilder('as')
      .leftJoinAndMapMany(
        'as.parameters',
        Parameter,
        'pa',
        'as.id = pa.assessmentId',
      )
      .leftJoinAndMapMany(
        'pa.parameterRequest',
        ParameterRequest,
        'par',
        'par.ParameterId = pa.id',
      )

      .where(
        'par.dataRequestStatus in (11) AND as.id =' +
          assessmentId.toString() +
          ' AND (pa.projectionBaseYear = ' +
          assessmenYear.toString() +
          ' OR  pa.AssessmentYear = ' +
          assessmenYear.toString() +
          ')',
      );

    const totalRecordsApprovedStatus: any[] = await data2.execute();

    if (totalRecordsApprovedStatus.length == totalRecordsAllStatus.length) {
      return true;
    }
    return false;
  }

  async checkAssessmentReadyForCalculate(
    assessmentId: number,
    assessmenYear: number,
  ): Promise<boolean> {
    const data = this.repo
      .createQueryBuilder('as')
      .innerJoinAndMapMany(
        'as.parameters',
        Parameter,
        'para',
        'as.id = para.assessmentId',
      )
      .innerJoinAndMapMany(
        'para.parameterRequest',
        ParameterRequest,
        'par',
        'par.ParameterId = para.id',
      )
      .where(
        'par.UserDataEntry is not null AND as.id =' +
          assessmentId.toString() +
          ' AND (para.projectionBaseYear = ' +
          assessmenYear.toString() +
          ' OR  para.AssessmentYear = ' +
          assessmenYear.toString() +
          ')',
      );

    const totalRecordsAllStatus: any[] = await data.execute();
    const data2 = this.repo
      .createQueryBuilder('as')
      .leftJoinAndMapMany(
        'as.parameters',
        Parameter,
        'para',
        'as.id = para.assessmentId',
      )
      .leftJoinAndMapMany(
        'para.parameterRequest',
        ParameterRequest,
        'par',
        'par.ParameterId = para.id',
      )

      .where(
        'par.qaStatus in (4) AND as.id =' +
          assessmentId.toString() +
          ' AND (para.projectionBaseYear = ' +
          assessmenYear.toString() +
          ' OR  para.AssessmentYear = ' +
          assessmenYear.toString() +
          ')',
      );

    const totalRecordsApprovedStatus: any[] = await data2.execute();

    if (totalRecordsApprovedStatus.length == totalRecordsAllStatus.length) {
      return true;
    }

    return false;
  }

  async getAssessmentForApproveData(
    assessmentId: number,
    assessmentYear: string,
    userName: string,
  ): Promise<any> {
    const data = this.repo
      .createQueryBuilder('as')
      .leftJoinAndMapMany(
        'as.parameters',
        Parameter,
        'pa',
        'as.id = pa.assessmentId ',
      )
      .leftJoinAndMapOne(
        'pa.institution',
        Institution,
        'in',
        'in.id = pa.institutionId',
      )
      .leftJoinAndMapOne(
        'pa.parameterRequest',
        ParameterRequest,
        'par',
        'par.ParameterId = pa.id',
      )
      .leftJoinAndMapOne('as.ndc', Ndc, 'ndc', 'ndc.id = as.ndcId')
      .leftJoinAndMapOne('as.subNdc', SubNdc, 'sndc', 'sndc.id = as.subNdcId')
      .leftJoinAndMapOne(
        'as.methodology',
        Methodology,
        'me',
        'me.id = as.methodologyId',
      )
      .leftJoinAndMapOne('as.project', Project, 'pr', 'pr.id = as.projectId')
      .where(
        `as.id = ${assessmentId} AND par.dataRequestStatus in (9,-9,11) AND (pa.AssessmentYear =  '${assessmentYear}' or pa.isProjection)`,
      );
    return await data.getOne();
  }

  async getAssmentDetailsByProjectId(projectId: number): Promise<any> {
    let filter = '';

    if (projectId != 0) {
      filter = `pt.id = :projectId`;
    }

    const data = this.repo
      .createQueryBuilder('asse')
      .leftJoinAndMapOne(
        'asse.project',
        Project,
        'pt',
        'pt.id = asse.projectId',
      )
      .where(filter, {
        projectId,
      })
      .orderBy('asse.editedOn', 'DESC');
  }

  async getAssessmentsBYProjectId(id: number): Promise<any> {
    const project = new Project();
    project.id = id;
    return await this.repo.find({ where: { project: project } });
  }

  async getMethodologyNameByAssessmentId(id: number): Promise<any> {
    let filter = '';
    filter = `asse.id = :id`;

    const data = this.repo
      .createQueryBuilder('asse')
      .leftJoinAndMapOne(
        'asse.methodology',
        Methodology,
        'meth',
        'asse.methodologyId = meth.id',
      )
      .where(filter, { id });

    const result = await data.getOneOrFail();

    if (result) {
      return result;
    }
  }

  getAssessmentsByCountryMethodology(methodId: number, countryId: number) {
    const filter = `asse.methodologyId = :methodId AND asse.countryId = :countryId`;

    const data = this.repo
      .createQueryBuilder('asse')
      .leftJoinAndMapOne(
        'asse.methodology',
        Methodology,
        'meth',
        'asse.methodologyId = meth.id',
      )
      .where(filter, { methodId, countryId });

    return data.getMany();
  }

  async testTransaction(): Promise<any> {
    let filter = '';
    filter = `asse.id = 216`;

    const data = this.repo
      .createQueryBuilder('asse')
      .leftJoinAndMapOne(
        'asse.methodology',
        Methodology,
        'meth',
        'asse.methodologyId = meth.id',
      )
      .where(filter, {});

    const result = await data.getOneOrFail();

    if (result) {
      return result;
    }
  }
}
