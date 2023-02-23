import { AssessmentResault } from './../assesment-resault/entity/assessment-resault.entity';
import { Assessment } from 'src/assesment/entity/assesment.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { AssessmentYear } from './entity/assessment-year.entity';
import { Project } from 'src/project/entity/project.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { User } from 'src/users/user.entity';
import { DataVerifierDto } from './Dto/dataVerifier.dto';
import { ParameterHistoryService } from 'src/parameter-history/parameter-history.service';
import { ParameterHistoryAction } from 'src/parameter-history/entity/paeameter-history-action-history.entity';
import { VerificationDetail } from 'src/verification/entity/verification-detail.entity';
import { Parameter } from 'src/parameter/entity/parameter.entity';
import { Console } from 'console';
import { Ndc } from 'src/master-data/ndc/ndc.entity';
import { SubNdc } from 'src/master-data/ndc/sub-ndc.entity';
import { UsersService } from 'src/users/users.service';
import { Institution } from 'src/institution/institution.entity';
import { Repository } from 'typeorm';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { Methodology } from 'src/methodology/entity/methodology.entity';
import { ProjectionResault } from 'src/projection-resault/entity/projection-resault.entity';
import { ProjectOwner } from 'src/master-data/project-owner/projeect-owner.entity';
import { ProjectStatus } from 'src/master-data/project-status/project-status.entity';

@Injectable()
export class AssessmentYearService extends TypeOrmCrudService<AssessmentYear> {
  constructor(
    @InjectRepository(AssessmentYear) repo,
    @InjectRepository(Institution)
    public institutionRepo: Repository<Institution>,

    private readonly parameterHistoryService: ParameterHistoryService,
    private readonly userService: UsersService,
    private readonly emaiService: EmailNotificationService,
  ) {
    super(repo);
  }

  async getAllYearsByProjectId(projectId: number): Promise<any> {
    const data = this.repo
      .createQueryBuilder('ay')
      .leftJoinAndMapOne(
        'ay.assessment',
        Assessment,
        'a',
        'a.id = ay.assessmentId',
      )
      .leftJoinAndMapOne('a.Project', Project, 'p', 'a.projectId = p.id')

      .select('ay.assessmentYear as assessmentYear')
      .where('p.id=' + projectId)
      .orderBy('ay.assessmentYear', 'DESC');
    const result = await data.execute();

    return result;
  }

  async mail(id: number) {
    const dataRequestItem = await this.repo.findOne({
      where: { id: id },
      relations: ['assessment'],
    });
    const inscon = dataRequestItem.assessment.project.country;

    const insSec = dataRequestItem.assessment.project.sector;
    let user: User[];

    const ins = await this.institutionRepo.findOne({
      where: { country: inscon, sector: insSec, type: 2 },
    });
    user = await this.userService.find({
      where: { country: inscon, userType: 5, institution: ins },
    });
    user.forEach((ab) => {
      const template =
        'Dear ' +
        ab.username +
        ' ' +
        ' <br/> Data request with following information has shared with you.';

      this.emaiService.sendMail(ab.email, 'Accepted QC', '', template);
    });
  }

  async getAssessmentByYearId(yearId: number, userName: string): Promise<any> {
    const userItem = await this.userService.findByUserName(userName);

    const institutionId = userItem.institution ? userItem.institution.id : 0;

    const data = this.repo
      .createQueryBuilder('ay')
      .leftJoinAndMapOne(
        'ay.assessment',
        Assessment,
        'a',
        'a.id = ay.assessmentId',
      )
      .leftJoinAndMapMany(
        'a.parameters',
        Parameter,
        'pa',
        'a.id = pa.assessmentId',
      )
      .leftJoinAndMapOne(
        'pa.institution',
        Institution,
        'in',
        'in.id = pa.institutionId',
      )
      .leftJoinAndMapOne('a.Project', Project, 'p', 'a.projectId = p.id')
      .leftJoinAndMapOne('a.ndc', Ndc, 'ndc', 'ndc.id = a.ndcId')
      .leftJoinAndMapOne('a.subNdc', SubNdc, 'sndc', 'sndc.id = a.subNdcId')

      .where('ay.id=' + yearId);

    const result = await data.getOne();

    return result;
  }

  async getDataForReport(
    projIds: string,
    assessTypes: string,
    yearIds: string,
  ): Promise<any> {
    const data = this.repo
      .createQueryBuilder('ay')
      .leftJoinAndMapOne(
        'ay.assessment',
        Assessment,
        'a',
        'a.id = ay.assessmentId',
      )
      .leftJoinAndMapOne(
        'a.id',
        AssessmentResault,
        'ar',
        'a.id = ar.assementId',
      )
      .leftJoinAndMapMany(
        'a.parameters',
        Parameter,
        'pa',
        'a.id = pa.assessmentId',
      )

      .leftJoinAndMapOne('a.Project', Project, 'p', 'a.projectId = p.id')
      .leftJoinAndMapOne('p.ndc', Ndc, 'ndc', 'p.ndcId = ndc.Id')
      .leftJoinAndMapOne('a.subNdc', SubNdc, 'sndc', 'sndc.id = a.subNdcId')

      .select(
        'distinct ndc.name as NDC , p.climateActionName as ClimateAction , ay.assessmentYear as Year, a.assessmentType as Type  , ar.totalEmission as Result , ar.macResult as MACResult',
      )
      .where(
        'ay.id IN (' +
          yearIds +
          ') AND a.assessmentType IN (' +
          assessTypes +
          ') AND p.id IN (' +
          projIds +
          ')',
      )
      .orderBy('a.assessmentType', 'ASC')
      .orderBy('ay.assessmentYear', 'ASC')
      .orderBy('p.climateActionName', 'ASC')
      .orderBy('ndc.name', 'ASC');

    const result = await data.execute();
    return result;
  }

  async getDataForReportNew(
    projIds: string,
    assessTypes: string,
    yearIds: string,
    macAssesmentType: string,
  ): Promise<any> {
    if (macAssesmentType.length == 0) {
      macAssesmentType = `''`;
    }

    if (assessTypes.length == 0) {
      assessTypes = `''`;
    }

    const data = this.repo
      .createQueryBuilder('ay')
      .leftJoinAndMapOne(
        'ay.assessment',
        Assessment,
        'a',
        'a.id = ay.assessmentId',
      )

      .leftJoinAndMapOne(
        'a.id',
        AssessmentResault,
        'ar',
        'ay.id = ar.assessmentYearId',
      )
      .leftJoinAndMapMany(
        'a.parameters',
        Parameter,
        'pa',
        'a.id = pa.assessmentId',
      )

      .leftJoinAndMapOne('a.Project', Project, 'p', 'a.projectId = p.id')
      .leftJoinAndMapOne(
        'a.methodology',
        Methodology,
        'meth',
        'meth.id = a.methodologyId',
      )
      .leftJoinAndMapOne(
        'a.projectionResult',
        ProjectionResault,
        'projResult',
        'projResult.assementId = a.id',
      )
      .leftJoinAndMapOne('p.ndc', Ndc, 'ndc', 'p.ndcId = ndc.Id')
      .leftJoinAndMapOne('a.subNdc', SubNdc, 'sndc', 'sndc.id = a.subNdcId')
      .leftJoinAndMapOne(
        'p.projectOwner',
        ProjectOwner,
        'powner',
        'p.projectOwnerId = powner.id',
      )
      .leftJoinAndMapOne(
        'p.projectStatus',
        ProjectStatus,
        'pstatus',
        'p.projectStatusId = pstatus.id',
      )

      .select(
        `distinct a.id as assesmentId,a.isProposal as isProposal, ndc.name as NDC , p.climateActionName as ClimateAction , ay.assessmentYear as Year, a.assessmentType as Type, a.baseYear as BaseYear, meth.name as MethName, p.subNationalLevl1 as SubnOne, p.subNationalLevl2 as SubnTwo, p.subNationalLevl3 as SubnThree, p.proposeDateofCommence as ProposeDateCommence,projResult.projectionYear as PrjectionYear, meth.transportSubSector as TsubSector, meth.upstream_downstream as UpDownStream, meth.ghgIncluded as GhgInc, a.baselineScenario as BaseS, ar.baselineResult as BaseR, a.projectScenario as ProjectS, ar.projectResult as ProjectR, a.lekageScenario as LeakageS, ar.lekageResult as LeakageR  , ar.totalEmission as Result , ar.macResult as MACResult, a.ghgAssessTypeForMac as TypeOfMac, a.emmisionReductionValue as EmmisionValue, sndc.name as SNDC, p.institution as Institution, powner.name as ProjectOwner, p.objective as Objective, p.projectScope as ProjectScope, p.outcome as OutCome, p.directSDBenefit as DirectB, p.indirectSDBenefit as IndreactB, pstatus.name as ProjectStatus `,
      )

      .where(
        `ay.verificationStatus = 7 and a.assessmentType <> 'MAC' AND ay.id IN(` +
          yearIds +
          ' ) AND a.assessmentType IN(' +
          assessTypes +
          ') ' +
          ' OR ' +
          (`ay.verificationStatus = 7 and a.assessmentType = 'MAC' AND ay.id IN (` +
            yearIds +
            ') AND a.ghgAssessTypeForMac IN (' +
            macAssesmentType +
            ') '),
      )
      .orderBy('a.assessmentType', 'ASC')
      .orderBy('ay.assessmentYear', 'ASC')
      .orderBy('p.climateActionName', 'ASC')
      .orderBy('ndc.name', 'ASC');

    const result = await data.execute();
    return result;
  }

  async getDataForParameterReportNew(
    projIds: string,
    assessTypes: string,
    yearIds: string,
    macAssesmentType: string,
  ): Promise<any> {
    if (macAssesmentType.length == 0) {
      macAssesmentType = `''`;
    }

    if (assessTypes.length == 0) {
      assessTypes = `''`;
    }

    const data = this.repo
      .createQueryBuilder('ay')
      .leftJoinAndMapOne(
        'ay.assessment',
        Assessment,
        'a',
        'a.id = ay.assessmentId',
      )
      .leftJoinAndMapOne(
        'a.id',
        AssessmentResault,
        'ar',
        'a.id = ar.assementId',
      )
      .leftJoinAndMapMany(
        'a.parameters',
        Parameter,
        'pa',
        'a.id = pa.assessmentId',
      )

      .leftJoinAndMapOne('a.Project', Project, 'p', 'a.projectId = p.id')
      .leftJoinAndMapOne(
        'a.methodology',
        Methodology,
        'meth',
        'meth.id = a.methodologyId',
      )
      .leftJoinAndMapOne(
        'a.projectionResult',
        ProjectionResault,
        'projResult',
        'projResult.assementId = a.id',
      )
      .leftJoinAndMapOne('p.ndc', Ndc, 'ndc', 'p.ndcId = ndc.Id')
      .leftJoinAndMapOne('a.subNdc', SubNdc, 'sndc', 'sndc.id = a.subNdcId')

      .select(
        `distinct a.id as assesmentId, ndc.name as NDC , p.climateActionName as ClimateAction , ay.assessmentYear as Year, a.assessmentType as Type, a.baseYear as BaseYear, meth.name as MethName, p.subNationalLevl1 as SubnOne, p.subNationalLevl2 as SubnTwo, p.subNationalLevl3 as SubnThree, p.proposeDateofCommence as ProposeDateCommence,projResult.projectionYear as PrjectionYear, meth.transportSubSector as TsubSector, meth.upstream_downstream as UpDownStream, meth.ghgIncluded as GhgInc, a.baselineScenario as BaseS, ar.baselineResult as BaseR, a.projectScenario as ProjectS, ar.projectResult as ProjectR, a.lekageScenario as LeakageS, ar.lekageResult as LeakageR  , ar.totalEmission as Result , ar.macResult as MACResult, a.ghgAssessTypeForMac as TypeOfMac, a.emmisionReductionValue as EmmisionValue, CASE    WHEN pa.isBaseline THEN 'Baseline'    WHEN pa.isProject THEN 'Project'    WHEN pa.isLekage THEN 'Lekage'   END AS ParaType,pa.name as KeyIndicator, pa.value as ParaValue, pa.uomDataRequest as ParaUnit`,
      )

      .where(
        `ay.verificationStatus = 7 and a.assessmentType <> 'MAC' AND ay.id IN(` +
          yearIds +
          ' ) AND a.assessmentType IN(' +
          assessTypes +
          ') AND p.id IN(' +
          projIds +
          ')' +
          ' OR ' +
          (`ay.verificationStatus = 7 and a.assessmentType = 'MAC' AND ay.id IN (` +
            yearIds +
            ') AND a.ghgAssessTypeForMac IN (' +
            macAssesmentType +
            ') AND p.id IN (' +
            projIds +
            ')'),
      )
      .orderBy('a.assessmentType', 'ASC')
      .orderBy('ay.assessmentYear', 'ASC')
      .orderBy('p.climateActionName', 'ASC')
      .orderBy('ndc.name', 'ASC');

    const result = await data.execute();
    return result;
  }

  async getAssessmentForAssignVerifiers(
    options: IPaginationOptions,
    filterText: string,
    QAstatusId: number,
    countryIdFromTocken: number,
  ): Promise<any> {
    const data = this.repo
      .createQueryBuilder('ay')
      .innerJoinAndMapOne(
        'ay.assessment',
        Assessment,
        'a',
        'a.id = ay.assessmentId',
      )
      .innerJoinAndMapOne(
        'a.Project',
        Project,
        'p',
        `a.projectId = p.id and p.countryId = ${countryIdFromTocken}`,
      )

      .leftJoinAndMapOne(
        'ay.verificationUser',
        User,
        'u',
        'ay.verificationUser = u.id',
      )
      .where(
        (
          (QAstatusId != 0
            ? `ay.verificationStatus=${QAstatusId} AND `
            : `ay.verificationStatus in (2,3,4,5,6,7) AND `) +
          `ay.qaStatus in (4) AND ` +
          (filterText != ''
            ? `(p.climateActionName LIKE '%${filterText}%' OR a.assessmentType LIKE '%${filterText}%' OR u.username LIKE '%${filterText}%'
           )`
            : '')
        ).replace(/AND $/, ''),
      )

      .orderBy('ay.verificationDeadline', 'DESC')
      .groupBy('ay.id');

    const result = await paginate(data, options);
    return result;
  }

  async getAllYearsByAssessmentId(assesmentId: number): Promise<any> {
    const data = this.repo
      .createQueryBuilder('ay')

      .where('ay.assessmentId = ' + assesmentId);

    const result = await data.getRawMany();

    return result;
  }

  async acceptDataVerifiersForIds(
    updateDataRequestDto: DataVerifierDto,
  ): Promise<boolean> {
    for (let index = 0; index < updateDataRequestDto.ids.length; index++) {
      const id = updateDataRequestDto.ids[index];
      const dataRequestItem = await this.repo.findOne({ where: { id: id } });
      const originalStatus = dataRequestItem.verificationStatus;

      dataRequestItem.verificationDeadline = updateDataRequestDto.deadline;
      dataRequestItem.verificationUser = updateDataRequestDto.userId;

      const user = await this.userService.findOne({
        where: { id: updateDataRequestDto.userId },
      });

      var template: any;
      template =
        'Dear ' +
        user.firstName +
        ' ' +
        user.lastName +
        ' <br/> Data request with following information has shared with you.' +
        this.emaiService.sendMail(user.email, 'Assign verifier', '', template);

      this.repo.save(dataRequestItem).then((res) => {});
    }

    return true;
  }

  async acceptQC(updateDataRequestDto: DataVerifierDto): Promise<boolean> {
    let insSec: any;
    let inscon: any;

    for (let index = 0; index < updateDataRequestDto.ids.length; index++) {
      const id = updateDataRequestDto.ids[index];
      const dataRequestItem = await this.repo.findOne({
        where: { id: id },
        relations: ['assessment'],
      });

      const originalStatus = dataRequestItem.qaStatus;
      dataRequestItem.qaStatus = updateDataRequestDto.status;

      inscon = dataRequestItem.assessment.project.country;

      insSec = dataRequestItem.assessment.project.sector;

      this.repo.save(dataRequestItem).then((res) => {});
    }
    let user: User[];
    const ins = await this.institutionRepo.findOne({
      where: { country: inscon, sector: insSec, type: 2 },
    });
    user = await this.userService.find({
      where: { country: inscon, userType: 7, institution: ins },
    });
    user.forEach((ab) => {
      let template: any;
      if (updateDataRequestDto.comment != undefined) {
        template =
          'Dear ' +
          ab.username +
          ' ' +
          ' <br/> Data request with following information has shared with you.' +
          '<br> comment -: ' +
          updateDataRequestDto.comment;
      } else {
        template =
          'Dear ' +
          ab.username +
          ' ' +
          ' <br/>Data request with following information has shared with you.';
      }

      this.emaiService.sendMail(ab.email, 'Please verify', '', template);
    });

    return true;
  }

  async getVerificationDetails(
    assessmentId: number,
    assementYear: string,
  ): Promise<any> {
    const filter =
      'ass.id = :assessmentId and assYear.assessmentYear = :assementYear';

    const data = this.repo
      .createQueryBuilder('assYear')
      .leftJoinAndMapOne(
        'assYear.assessment',
        Assessment,
        'ass',
        'ass.id = assYear.assessmentId',
      )
      .leftJoinAndMapMany(
        'assYear.verificationDetail',
        VerificationDetail,
        'vrd',
        'vrd.assessmentYearId = assYear.id',
      )
      .leftJoinAndMapOne(
        'vrd.parameter',
        Parameter,
        'pr',
        'pr.id = vrd.parameterId',
      )
      .where(filter, {
        assessmentId,
        assementYear,
      });

    return await data.getMany();
  }

  async getdetailsByAssessmentYearAndProjNameAndAsseType(
    assessmentType: string,
    assementYear: string,
    climateActionName: string,
  ): Promise<any> {
    const filter =
      'ass.assessmentType = :assessmentType and assYear.assessmentYear = :assementYear and pr.climateActionName = :climateActionName';

    const data = this.repo
      .createQueryBuilder('assYear')
      .leftJoinAndMapOne(
        'assYear.assessment',
        Assessment,
        'ass',
        'ass.id = assYear.assessmentId',
      )
      .leftJoinAndMapOne('ass.project', Project, 'pr', 'pr.id = ass.projectId')
      .where(filter, {
        assessmentType,
        assementYear,
        climateActionName,
      });
    return await data.getOne();
  }

  async getYearListByAssessmentId(id: number): Promise<AssessmentYear[]> {
    const assement = new Assessment();
    assement.id = id;
    return await this.repo.find({ where: { assessment: assement } });
  }

  async getAssessmentYearsForCountryAndSectorAdmins(
    options: IPaginationOptions,
    isPost: number,
    sectorId: number,
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
  ): Promise<any> {
    let filter = '';

    if (isPost == 0) {
      if (filter) {
        filter = `${filter}  and asse.ghgAssessTypeForMac = 'ex-post' `;
      } else {
        filter = `asse.ghgAssessTypeForMac = 'ex-post' `;
      }
    } else {
      if (filter) {
        filter = `${filter}  and asse.ghgAssessTypeForMac = 'ex-ante'`;
      } else {
        filter = `asse.ghgAssessTypeForMac = 'ex-ante'`;
      }
    }

    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and pro.countryId = :countryIdFromTocken`;
      } else {
        filter = `pro.countryId = :countryIdFromTocken`;
      }
    }

    if (sectorIdFromTocken) {
      if (filter) {
        filter = `${filter}  and pro.sectorId = :sectorIdFromTocken  `;
      } else {
        filter = `pro.sectorId = :sectorIdFromTocken`;
      }
    } else {
      if (sectorId != 0) {
        if (filter) {
          filter = `${filter}  and pro.sectorId = :sectorId`;
        } else {
          filter = `pro.sectorId = :sectorId`;
        }
      }
    }

    const data = this.repo
      .createQueryBuilder('asseYr')
      .innerJoinAndMapOne(
        'asseYr.assessment',
        Assessment,
        'asse',
        'asse.id = asseYr.assessmentId ',
      )
      .innerJoinAndMapOne(
        'asse.project',
        Project,
        'pro',
        'asse.projectId = pro.id',
      )

      .select([
        'asseYr.assessmentYear',
        'asse.id',
        'asse.emmisionReductionValue',
        'asse.macValue',
        'pro.climateActionName',
        'asse.ghgAssessTypeForMac',
      ])
      .where(filter, {
        countryIdFromTocken,
        sectorIdFromTocken,
        sectorId,
      })

      .orderBy('asseYr.createdOn', 'ASC');

    const result = await paginate(data, options);

    if (result) {
      return result;
    }
  }

  async getAssessmentYearsWiseMacGraphDataToSummeryReport(
    options: IPaginationOptions,
    isPost: number,
    sectorId: number,
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
    assementYears: number[],
    assementType: string[],
    projectId: string[],
  ): Promise<any> {
    let filter = '';
    if (isPost == 0) {
      if (filter) {
        filter = `${filter}  and asse.ghgAssessTypeForMac = 'ex-post' `;
      } else {
        filter = `asse.ghgAssessTypeForMac = 'ex-post' `;
      }
    } else {
      if (filter) {
        filter = `${filter}  and asse.ghgAssessTypeForMac = 'ex-ante'`;
      } else {
        filter = `asse.ghgAssessTypeForMac = 'ex-ante'`;
      }
    }

    if (assementYears && assementYears.length > 0) {
      if (filter) {
        filter = `${filter}  and asseYr.assessmentYear IN (:...assementYears) `;
      } else {
        filter = ' asseYr.assessmentYear IN (:...assementYears)  ';
      }
    }
    if (assementType && assementType.length > 0) {
      if (filter) {
        filter = `${filter}  and asse.assessmentType IN (:...assementType) `;
      } else {
        filter = ' asse.assessmentType IN (:...assementType)  ';
      }
    }
    if (projectId && projectId.length > 0) {
      if (filter) {
        filter = `${filter}  and  pro.id IN (:...projectId) `;
      } else {
        filter = '  pro.id IN (:...projectId)  ';
      }
    }

    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and pro.countryId = :countryIdFromTocken`;
      } else {
        filter = `pro.countryId = :countryIdFromTocken`;
      }
    }

    if (sectorIdFromTocken) {
      if (filter) {
        filter = `${filter}  and pro.sectorId = :sectorIdFromTocken  `;
      } else {
        filter = `pro.sectorId = :sectorIdFromTocken`;
      }
    } else {
      if (sectorId != 0) {
        if (filter) {
          filter = `${filter}  and pro.sectorId = :sectorId`;
        } else {
          filter = `pro.sectorId = :sectorId`;
        }
      }
    }

    const data = this.repo
      .createQueryBuilder('asseYr')
      .innerJoinAndMapOne(
        'asseYr.assessment',
        Assessment,
        'asse',
        'asse.id = asseYr.assessmentId',
      )
      .innerJoinAndMapOne(
        'asse.project',
        Project,
        'pro',
        'asse.projectId = pro.id',
      )

      .select([
        'asseYr.assessmentYear',
        'asse.id',
        'asse.emmisionReductionValue',
        'asse.macValue',
        'pro.climateActionName',
      ])
      .where(filter, {
        countryIdFromTocken,
        sectorIdFromTocken,
        sectorId,
        assementYears,
        assementType,
        projectId,
      })

      .orderBy('asseYr.createdOn', 'ASC');

    const result = await paginate(data, options);

    if (result) {
      return result;
    }
  }

  async getAssessmentByYearAndProjectId(
    year: string,
    projectId: number,
  ): Promise<any> {
    let filter = '';
    const type: any = 'MAC';
    const stage: any = 0;
    filter = `asseYear.assessmentYear = :year and pr.id = :projectId and asse.assessmentType != :type and asse.isProposal = :stage `;

    const data = this.repo
      .createQueryBuilder('asseYear')
      .leftJoinAndMapOne(
        'asseYear.Assessment',
        Assessment,
        'asse',
        'asseYear.assessmentId = asse.id',
      )
      .leftJoinAndMapOne(
        'asse.Project',
        Project,
        'pr',
        'asse.projectId = pr.id',
      )
      .where(filter, { year, projectId, type, stage });

    const resualt = await data.getOne();

    if (resualt) {
      return resualt;
    }
  }

  async assessmentYearForManageDataStatus(
    options: IPaginationOptions,
    filterText: string,
    projectStatusId: number,
    projectApprovalStatusId: number,
    isProposal: number,
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
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

    if (sectorIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and proj.sectorId = :sectorIdFromTocken`;
      } else {
        filter = `proj.sectorId = :sectorIdFromTocken`;
      }
    }
    let select: string[];

    const data = this.repo
      .createQueryBuilder('assesYr')

      .leftJoinAndMapOne(
        'assesYr.assesment',
        Assessment,
        'asse',
        'asse.id = assesYr.assessmentId',
      )
      .leftJoinAndMapOne(
        'asse.project',
        Project,
        'proj',
        `proj.id = asse.projectId and  proj.countryId = ${countryIdFromTocken}`,
      )
      .select([
        'asse.id',
        'assesYr.id',
        'assesYr.assessmentYear',
        'assesYr.qaStatus',
        'asse.assessmentType',
        'proj.climateActionName',
      ])
      .where(filter, {
        filterText: `%${filterText}%`,
        isProposal,
        projectStatusId,
        projectApprovalStatusId,

        sectorIdFromTocken,
      })
      .orderBy('asse.createdOn', 'DESC');

    const resualt = await paginate(data, options);

    if (resualt) {
      return resualt;
    }
  }

  async getAssessmentYearsListInTrackCA(
    countryIdFromTocken: number,
  ): Promise<any> {
    const data = this.repo
      .createQueryBuilder('asseYear')
      .leftJoinAndMapOne(
        'asseYear.Assessment',
        Assessment,
        'ass',
        'asseYear.assessmentId = ass.id',
      )
      .innerJoinAndMapOne(
        'ass.Project',
        Project,
        'pro',
        `ass.projectId = pro.id and pro.countryId = ${countryIdFromTocken}`,
      );

    const result = await data.getMany();

    return result;
  }
}
