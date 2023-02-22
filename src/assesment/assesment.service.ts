import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { AssessmentResault } from 'src/assesment-resault/entity/assessment-resault.entity';

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
import { Assessment } from './entity/assesment.entity';
import { filter } from 'rxjs';

@Injectable()
export class AssesmentService extends TypeOrmCrudService<Assessment> {
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
          // `meth.id = asse.methodologyId and asse.methodolgyId IS NOT NULL  and meth.countryId = ${country} `
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
    // assessmentStatusName: string,
    // Active: number,
    countryId: number,
    sectorId: number,
    isProposal: number,
  ): Promise<any> {
    let filter = '';
    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        // '(dr.climateActionName LIKE :filterText OR asse.assessmentType LIKE :filterText OR para.AssessmentYear LIKE :filterText OR dr.institution LIKE :filterText OR pas.name LIKE :filterText OR pst.name LIKE :filterText OR dr.contactPersoFullName LIKE :filterText  OR dr.editedOn LIKE :filterText OR dr.createdOn LIKE :filterText OR dr.acceptedDate LIKE :filterText)';
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

    //when add assesmentStatusName make sure it is not added with empty

    // if (
    //   assessmentStatusName != null &&
    //   assessmentStatusName != undefined &&
    //   assessmentStatusName != ''
    // ) {
    //   if (filter) {
    //     filter = `${filter}  and asse.assessmentStage = :assessmentStatusName`;
    //   } else {
    //     filter = `asse.assessmentStage = :assessmentStatusName`;
    //   }
    // }

    // if active = 0 ---> whole climateactions list
    // if active = 1 ---> all climate actions
    // if active = 2 ---> active climate actions

    // if (Active == 1) {
    //   // console.log(Active);
    //   if (filter) {
    //     filter = `${filter}  and pas.id != 4 `; // no proposed CA s all climate
    //   } else {
    //     filter = `pas.id != 4`;
    //   }
    // } else if (Active == 2) {
    //   //console.log(Active);
    //   if (filter) {
    //     filter = `${filter}  and pas.id = 5 `; // only active CA s
    //   } else {
    //     filter = `pas.id = 5 `;
    //   }
    // }

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
    let select: string[];

    const data = this.repo
      .createQueryBuilder('asse')

      .leftJoinAndMapOne(
        'asse.project',
        Project,
        'proj',
        'proj.id = asse.projectId',
      )
      .leftJoinAndMapMany(
        'asse.assesmentYear',
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
        // assessmentStatusName,
        // Active,
        countryId,
        sectorId,
      })
      .orderBy('asse.createdOn', 'ASC');

    console.log(
      '=====================================================================',
    );

    // console.log("query",data.getQuery())
    const resualt = await paginate(data, options);
    // console.log('my result...', resualt);
    if (resualt) {
      console.log('results for manage..', resualt);
      return resualt;
    }
  }
  async assessmentForMAC(projectId: number): Promise<any> {
    let filter = '';

    // filter =' EXISTS (SELECT * FROM portelservice.assesment as ass1, portelservice.assesmentyear as assyr1 where ass1.id= assyr1.assessmentId and ass1.ghgAssessTypeForMac =asse.assessmentType and ay.assessmentYear=assyr1.assessmentYear and asse.projectId=ass1.projectId )'

    if (filter) {
      filter = `${filter}  and asse.assessmentType in ('Ex-post','Ex-ante')`;
    } else {
      filter = `asse.assessmentType  in ('Ex-post','Ex-ante')`;
    }

    //console.log(isProposal);
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

    // let ltype = 'ASC';

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
    // .orderBy('asse.editedOn', 'DESC');
    // .orderBy(
    //   `(case when asse.assessmentStatus = 2 then 1 when asse.assessmentStatus = 1 then 2 end)`,
    //   'DESC',
    // )
    // .addOrderBy('asse.editedOn', 'DESC');
    console.log('im in....');
    const resualt = await data.execute();

    if (resualt) {
      return resualt;
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
    console.log('im in....');
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
        AssessmentResault,
        'ar',
        'ar.assementId = asse.id',
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

    const resualt = await paginate(data, options);

    if (resualt) {
      return resualt;
    }
  }

  async getAssessmentData(
    options: IPaginationOptions,
    assementYear: string[],
  ): Promise<any> {
    const arr = [];

    // console.log(year);
    const i = 0;
    const filter = '';
    // for(let year of assementYear){
    // if (assementYear != null && assementYear != undefined) {
    //   if (filter) {
    //     filter = `${filter}  and ass.assessmentYear in :assementYear`;
    //   } else {
    //     filter = `ass.assessmentYear in :assementYear`;
    //   }

    // }
    // }}

    // assementYear.forEach((year,index)=>{
    //    if (year != null && year != undefined && year != '') {
    //   if (filter) {
    //     filter = `${filter}  and ass.assessmentYear = :year`;
    //   } else {
    //     filter = `dr.assessmentYear = :year`;
    //   }
    // })

    const data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapMany(
        'dr',
        AssessmentYear,
        'ass',
        'ass.assessmentId = dr.id',
      )

      .where(filter, assementYear);

    arr.push(data);

    const resualt = await paginate(data, options);

    if (resualt) {
      return resualt;
    }
  }

  //get one assesment
  async getAssessmentDetails(
    assessmentId: number,
    assementYear: string,
  ): Promise<any> {
    const filter = 'as.id = :assessmentId';

    // if (
    //   assementYear != undefined &&
    //   assementYear != null &&
    //   assementYear != ''
    // ) {
    //   filter = filter + ' and pa.AssessmentYear = :assementYear';
    // }

    const data = this.repo
      .createQueryBuilder('as')
      .leftJoinAndMapMany(
        'as.parameters',
        Parameter,
        'pa',
        'as.id = pa.assessmentId and (pa.AssessmentYear = :assementYear or pa.isProjection)',
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
        assementYear,
      });

    // console.log('data.....',data)
    //console.log('query...', data.getQueryAndParameters());
    return await data.getOne();
  }
  async getAssessmentDetailsForQC(
    assessmentId: number,
    assementYear: string,
  ): Promise<any> {
    const filter = 'as.id = :assessmentId';

    // if (
    //   assementYear != undefined &&
    //   assementYear != null &&
    //   assementYear != ''
    // ) {
    //   filter = filter + ' and pa.AssessmentYear = :assementYear';
    // }

    const data = this.repo
      .createQueryBuilder('as')
      .leftJoinAndMapMany(
        'as.parameters',
        Parameter,
        'pa',
        // 'as.id = pa.assessmentId and (pa.AssessmentYear = :assementYear or pa.isProjection) and ((pa.isEnabledAlternative = true AND pa.isAlternative = true) OR (pa.isEnabledAlternative = false AND pa.isAlternative = false ))',
        `as.id = pa.assessmentId and COALESCE(pa.AssessmentYear ,pa.projectionBaseYear ) = ${assementYear} and ((pa.isEnabledAlternative = true AND pa.isAlternative = true) OR (pa.isEnabledAlternative = false AND pa.isAlternative = false ))`,
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
        assementYear,
      });

    // console.log('data.....',data)
    //console.log('query...', data.getQueryAndParameters());
    return await data.getOne();
  }

  async checkAssessmentReadyForQC(
    assessmentId: number,
    assessmenYear: number,
  ): Promise<boolean> {
    const asseType = await this.repo.findOne(assessmentId);
    //  console.log("assetype..",asseType.assessmentType)
    const filter = 'as.id = :assessmentId';

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

    // .where(
    //   'as.id =' + //'par.dataRequestStatus in (9,-9,11) AND as.id ='
    //     assessmentId.toString() + ` AND (para.isEnabledAlternative = true AND para.isAlternative = true OR para.isEnabledAlternative = false AND para.isAlternative = false ) AND COALESCE(para.AssessmentYear ,para.projectionBaseYear ) = ${assessmenYear }`,
    // );
    //console.log('data1SQL', data.getSql());
    const totalRecordsAllStatus: any[] = await data.execute();

    ///////////////////////////////////////////////////////////

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
    // console.log('data1SQL2', data2.getSql());
    const totalRecordsApprovedStatus: any[] = await data2.execute();

    console.log(
      'totalRecordsApprovedStatus',
      totalRecordsApprovedStatus.length,
    );
    console.log('totalRecordsAllStatus', totalRecordsAllStatus.length);

    if (totalRecordsApprovedStatus.length == totalRecordsAllStatus.length) {
      return true;
    }
    // if ( asseType?.assessmentType == "MAC") {
    //   return true;
    // }

    return false;
  }

  async checkAssessmentReadyForCalculate(
    assessmentId: number,
    assessmenYear: number,
  ): Promise<boolean> {
    const asseType = await this.repo.findOne(assessmentId);
    //  console.log("assetype..",asseType.assessmentType)
    const filter = 'as.id = :assessmentId';

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

    // .where(
    //   'as.id =' + //'par.dataRequestStatus in (9,-9,11) AND as.id ='
    //     assessmentId.toString() + ` AND (para.isEnabledAlternative = true AND para.isAlternative = true OR para.isEnabledAlternative = false AND para.isAlternative = false ) AND COALESCE(para.AssessmentYear ,para.projectionBaseYear ) = ${assessmenYear }`,
    // );
    //console.log('data1SQL', data.getSql());
    const totalRecordsAllStatus: any[] = await data.execute();

    ///////////////////////////////////////////////////////////

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
    // console.log('data1SQL2', data2.getSql());
    const totalRecordsApprovedStatus: any[] = await data2.execute();

    // var data3 = this.repo
    //   .createQueryBuilder('as')
    //   .leftJoinAndMapMany(
    //     'as.parameters',
    //     Parameter,
    //     'pa',
    //     'as.id = pa.assessmentId',
    //   )
    //   .leftJoinAndMapMany(
    //     'pa.parameterRequest',
    //     ParameterRequest,
    //     'par',
    //     'par.ParameterId = pa.id',
    //   )

    //   .where(
    //     'par.dataRequestStatus in (11) AND as.id =' + assessmentId.toString(),
    //   );
    // // console.log('data1SQL2', data2.getSql());
    // let totalRecordsQCApprovedStatus: any[] = await data3.execute();

    console.log(
      'totalRecordsApprovedStatus',
      totalRecordsApprovedStatus.length,
    );
    console.log('totalRecordsAllStatus', totalRecordsAllStatus.length);
    //    if (totalRecordsApprovedStatus.length  == totalRecordsAllStatus.length-1 || totalRecordsApprovedStatus.length  == totalRecordsAllStatus.length || totalRecordsApprovedStatus.length  == totalRecordsAllStatus.length-2)
    if (totalRecordsApprovedStatus.length == totalRecordsAllStatus.length) {
      return true;
    }
    // if ( asseType?.assessmentType == "MAC") {
    //   return true;
    // }

    return false;
  }

  //get one assesment
  async getAssessmentForApproveData(
    assessmentId: number,
    assementYear: string,
    userName: string,
  ): Promise<any> {
    // let filter: string =
    //   'as.id = :assessmentId AND par.dataRequestStatus in (9,-9,11) AND pa.AssessmentYear = :assementYear or pa.isProjection';

    const userItem = await this.userService.findByUserName(userName);
    console.log('userItem', userItem);
    const institutionId = userItem.institution ? userItem.institution.id : 0;

    // institutionId is not being used in the query
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
        `as.id = ${assessmentId} AND par.dataRequestStatus in (9,-9,11) AND (pa.AssessmentYear =  '${assementYear}' or pa.isProjection)`,
      ); //  'par.dataRequestStatus in (9,-9,11) AND as.id =' +
    // .where(filter, { and (pa.AssessmentYear = :assementYear or pa.isProjection)
    //   assessmentId,
    //   assementYear,
    // });

    console.log('ApproveData.....', data.getSql());
    //console.log('query...', data.getQueryAndParameters());
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
      // .orderBy('asse.editedOn', 'DESC');
      .orderBy('asse.editedOn', 'DESC');
    console.log(
      '7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777',
    );
    console.log(data);
    //  return data;
  }

  async getAssessmentsBYProjectId(id: number): Promise<any> {
    const project = new Project();
    project.id = id;
    return await this.repo.find({ where: { project: project } });
  }

  async getMethodologyNameByAssessmentId(id: number): Promise<any> {
    let filter = '';
    filter = `asse.id = :id`;
    // let assessement = this.repo.findOne(id);
    // let methId = this.meth
    // let project = new Project();
    // project.id = id;
    // return await this.repo.find({ where: { project: project } });

    const data = this.repo
      .createQueryBuilder('asse')
      .leftJoinAndMapOne(
        'asse.methodology',
        Methodology,
        'meth',
        'asse.methodologyId = meth.id',
      )
      .where(filter, { id });

    const resualt = await data.getOneOrFail();

    if (resualt) {
      return resualt;
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

    const resualt = await data.getOneOrFail();

    if (resualt) {
      return resualt;
    }
  }
}
