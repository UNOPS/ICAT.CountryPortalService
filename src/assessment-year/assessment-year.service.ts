import { AssessmentResult } from '../assessment-result/entity/assessment-result.entity';
import { Assessment } from 'src/assessment/entity/assessment.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { AssessmentYear } from './entity/assessment-year.entity';
import { Project } from 'src/project/entity/project.entity';
import { IPaginationMeta, IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { User } from 'src/users/user.entity';
import { DataVerifierDto } from './Dto/dataVerifier.dto';
import { ParameterHistoryService } from 'src/parameter-history/parameter-history.service';
import { VerificationDetail } from 'src/verification/entity/verification-detail.entity';
import { Parameter } from 'src/parameter/entity/parameter.entity';
import { Ndc } from 'src/master-data/ndc/ndc.entity';
import { SubNdc } from 'src/master-data/ndc/sub-ndc.entity';
import { UsersService } from 'src/users/users.service';
import { Institution } from 'src/institution/institution.entity';
import { Repository } from 'typeorm';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { Methodology } from 'src/methodology/entity/methodology.entity';
import { ProjectionResult } from 'src/projection-result/entity/projection-result.entity';
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
    const ins = await this.institutionRepo.findOne({
      where: { country: inscon, sector: insSec, type: 2 },
    });
    const user: User[] = await this.userService.find({
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
        AssessmentResult,
        'ar',
        'a.id = ar.assessmentId',
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
    macAssessmentType: string,
    moduleLevelsFromTocken:number[]
  ): Promise<any> {
    if (macAssessmentType.length == 0) {
      macAssessmentType = `''`;
    }

    if (assessTypes.length == 0) {
      assessTypes = `''`;
    }

    let data = this.repo
      .createQueryBuilder('ay')
      .leftJoinAndMapOne(
        'ay.assessment',
        Assessment,
        'a',
        'a.id = ay.assessmentId',
      )

      .leftJoinAndMapOne(
        'a.id',
        AssessmentResult,
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
        ProjectionResult,
        'projResult',
        'projResult.assessmentId = a.id',
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
        `distinct a.id as assessmentId,a.isProposal as isProposal, ndc.name as NDC , p.climateActionName as ClimateAction , ay.assessmentYear as Year, a.assessmentType as Type, a.baseYear as BaseYear, meth.name as MethName, p.subNationalLevl1 as SubnOne, p.subNationalLevl2 as SubnTwo, p.subNationalLevl3 as SubnThree, p.proposeDateofCommence as ProposeDateCommence,projResult.projectionYear as PrjectionYear, meth.transportSubSector as TsubSector, meth.upstream_downstream as UpDownStream, meth.ghgIncluded as GhgInc, a.baselineScenario as BaseS, ar.baselineResult as BaseR, a.projectScenario as ProjectS, ar.projectResult as ProjectR, a.lekageScenario as LeakageS, ar.lekageResult as LeakageR  , ar.totalEmission as Result , ar.macResult as MACResult, a.ghgAssessTypeForMac as TypeOfMac, a.emmisionReductionValue as EmmisionValue, sndc.name as SNDC, p.institution as Institution, powner.name as ProjectOwner, p.objective as Objective, p.projectScope as ProjectScope, p.outcome as OutCome, p.directSDBenefit as DirectB, p.indirectSDBenefit as IndreactB, pstatus.name as ProjectStatus `,
      )
      if (moduleLevelsFromTocken[3] == 1 || moduleLevelsFromTocken[4] == 1) {
        data =data.where(
          `ay.verificationStatus = 7 and a.assessmentType <> 'MAC' AND ay.id IN(` +
            yearIds +
            ' ) AND a.assessmentType IN(' +
            assessTypes +
            ') ' +
            ' OR ' +
            (`ay.verificationStatus = 7 and a.assessmentType = 'MAC' AND ay.id IN (` +
              yearIds +
              ') AND a.ghgAssessTypeForMac IN (' +
              macAssessmentType +
              ') '),
        )
        
      } else if (
                    moduleLevelsFromTocken[1] == 1 ||
                    moduleLevelsFromTocken[2] == 1
      ) {
        data =data.where(
          ` a.assessmentType <> 'MAC' AND ay.id IN(` +
            yearIds +
            ' ) AND a.assessmentType IN(' +
            assessTypes +
            ') ' +
            ' OR ' +
            (` a.assessmentType = 'MAC' AND ay.id IN (` +
              yearIds +
              ') AND a.ghgAssessTypeForMac IN (' +
              macAssessmentType +
              ') '),
        )      
       } else {
        data =data.where(
          `ay.verificationStatus = 7 and a.assessmentType <> 'MAC' AND ay.id IN(` +
            yearIds +
            ' ) AND a.assessmentType IN(' +
            assessTypes +
            ') ' +
            ' OR ' +
            (`ay.verificationStatus = 7 and a.assessmentType = 'MAC' AND ay.id IN (` +
              yearIds +
              ') AND a.ghgAssessTypeForMac IN (' +
              macAssessmentType +
              ') '),
        )
        
         } 
   
      data =data.orderBy('a.assessmentType', 'ASC')
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
    macAssessmentType: string,
  ): Promise<any> {
    if (macAssessmentType.length == 0) {
      macAssessmentType = `''`;
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
        AssessmentResult,
        'ar',
        'a.id = ar.assessmentId',
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
        ProjectionResult,
        'projResult',
        'projResult.assessmentId = a.id',
      )
      .leftJoinAndMapOne('p.ndc', Ndc, 'ndc', 'p.ndcId = ndc.Id')
      .leftJoinAndMapOne('a.subNdc', SubNdc, 'sndc', 'sndc.id = a.subNdcId')

      .select(
        `distinct a.id as assessmentId, ndc.name as NDC , p.climateActionName as ClimateAction , ay.assessmentYear as Year, a.assessmentType as Type, a.baseYear as BaseYear, meth.name as MethName, p.subNationalLevl1 as SubnOne, p.subNationalLevl2 as SubnTwo, p.subNationalLevl3 as SubnThree, p.proposeDateofCommence as ProposeDateCommence,projResult.projectionYear as PrjectionYear, meth.transportSubSector as TsubSector, meth.upstream_downstream as UpDownStream, meth.ghgIncluded as GhgInc, a.baselineScenario as BaseS, ar.baselineResult as BaseR, a.projectScenario as ProjectS, ar.projectResult as ProjectR, a.lekageScenario as LeakageS, ar.lekageResult as LeakageR  , ar.totalEmission as Result , ar.macResult as MACResult, a.ghgAssessTypeForMac as TypeOfMac, a.emmisionReductionValue as EmmisionValue, CASE    WHEN pa.isBaseline THEN 'Baseline'    WHEN pa.isProject THEN 'Project'    WHEN pa.isLekage THEN 'Lekage'   END AS ParaType,pa.name as KeyIndicator, pa.value as ParaValue, pa.uomDataRequest as ParaUnit`,
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
            macAssessmentType +
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

  async getAllYearsByAssessmentId(assessmentId: number): Promise<any> {
    const data = this.repo
      .createQueryBuilder('ay')

      .where('ay.assessmentId = ' + assessmentId);

    const result = await data.getRawMany();

    return result;
  }

  async acceptDataVerifiersForIds(
    updateDataRequestDto: DataVerifierDto,
  ): Promise<boolean> {
    for (let index = 0; index < updateDataRequestDto.ids.length; index++) {
      const id = updateDataRequestDto.ids[index];
      const dataRequestItem = await this.repo.findOne({ where: { id: id } });
      dataRequestItem.verificationDeadline = updateDataRequestDto.deadline;
      dataRequestItem.verificationUser = updateDataRequestDto.userId;

      const user = await this.userService.findOne({
        where: { id: updateDataRequestDto.userId },
      });

      let template: any;
      template = 'Dear ' + user.firstName + ' ' + user.lastName +
        ' <br/> You has been assigned to verify the following assessment.<br/>' + 
        '<br/> Climate Action Name- '+ dataRequestItem.assessment.project.climateActionName +
        '<br/> Assessment Year- '+ dataRequestItem.assessmentYear +
        '<br/> Assessment Type- ' + dataRequestItem.assessment.assessmentType;
        this.emaiService.sendMail(user.email, 'Assign verifier', '', template);

      this.repo.save(dataRequestItem).then((res) => {});
    }

    return true;
  }

  async acceptQC(updateDataRequestDto: DataVerifierDto): Promise<boolean> {
    let insSec: any;
    let inscon: any;
    let saveArray = [];

    for await (let index of updateDataRequestDto.ids) {
      const id = index;
      let dataRequestItem = await this.repo.findOne({ where: { id: id }});
      let originalStatus = dataRequestItem.qaStatus;
      dataRequestItem.qaStatus = updateDataRequestDto.status;

      inscon = dataRequestItem.assessment.project.country;
      insSec = dataRequestItem.assessment.project.sector;
      await this.repo.save(dataRequestItem).then((res) => {
        saveArray.push(res);
      });
    }
    let user: User[];
    let ins = await this.institutionRepo.findOne({ where: { country: inscon, sector: insSec, type: 2 } });
    user = await this.userService.find({ where: { country: inscon, userType: 7, institution: ins } })
    user.forEach((ab) => {
      var template: any;
      if (updateDataRequestDto.comment != undefined) {
        template =
          'Dear ' +
          ab.username + ' ' +
          ' <br/> Data request with following information has shared with you.' +
          '<br> comment -: ' + updateDataRequestDto.comment;
      }

      else {
        template =
          'Dear ' + ab.username + ' ' +
          ' <br/>Data request with following information has shared with you.'
      }

      this.emaiService.sendMail(
        ab.email,
        'Please verify',
        '',
        template,
      );
    })

    if (saveArray.length == updateDataRequestDto.ids.length) {
      return true;
    }
    else false
  }

  async getVerificationDetails(
    assessmentId: number,
    assessmentYear: string,
  ): Promise<any> {
    const filter =
      'ass.id = :assessmentId and assYear.assessmentYear = :assessmentYear';

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
        assessmentYear,
      });

    return await data.getMany();
  }

  async getdetailsByAssessmentYearAndProjNameAndAsseType(
    assessmentType: string,
    assessmentYear: string,
    climateActionName: string,
  ): Promise<any> {
    const filter =
      'ass.assessmentType = :assessmentType and assYear.assessmentYear = :assessmentYear and pr.climateActionName = :climateActionName';

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
        assessmentYear,
        climateActionName,
      });
    return await data.getOne();
  }

  async getYearListByAssessmentId(id: number): Promise<AssessmentYear[]> {
    const assessment = new Assessment();
    assessment.id = id;
    return await this.repo.find({ where: { assessment: assessment } });
  }

  async getAssessmentYearsForCountryAndSectorAdmins(
    options: IPaginationOptions,
    isPost: number,
    sectorId: number,
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
    moduleLevelsFromTocken: number[],
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
    if (moduleLevelsFromTocken[3] == 1 || moduleLevelsFromTocken[4] == 1) {
      if (filter) {
        filter = `${filter}   and asse.isProposal= false and asseYr.verificationStatus= 7 `;
      } else {
        filter = `asse.isProposal= false and asseYr.verificationStatus= 7`;
      }
    } else if (
      moduleLevelsFromTocken[1] == 1 ||
      moduleLevelsFromTocken[2] == 1
    ) {
      if (filter) {
        filter = `${filter}  and  asse.isProposal= true `;
      } else {
        filter = `asse.isProposal= true `;
      }
    } else {
      if (filter) {
        filter = `${filter}  and  asse.isProposal= false and asseYr.verificationStatus= 7 `;
      } else {
        filter = `asse.isProposal= false and asseYr.verificationStatus= 7`;
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
    assessmentYears: number[],
    assessmentType: string[],
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

    if (assessmentYears && assessmentYears.length > 0) {
      if (filter) {
        filter = `${filter}  and asseYr.assessmentYear IN (:...assessmentYears) `;
      } else {
        filter = ' asseYr.assessmentYear IN (:...assessmentYears)  ';
      }
    }
    if (assessmentType && assessmentType.length > 0) {
      if (filter) {
        filter = `${filter}  and asse.assessmentType IN (:...assessmentType) `;
      } else {
        filter = ' asse.assessmentType IN (:...assessmentType)  ';
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
        assessmentYears,
        assessmentType,
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

    const result = await data.getOne();

    if (result) {
      return result;
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
    climateActionId: number,
    year: string,
    getAll: string = 'false',
    approveStatus: string
  ): Promise<any> {
    climateActionId = Number(climateActionId)
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

    if (climateActionId !== 0) {
      if (filter) {
        filter = `${filter}  and proj.id = :climateActionId`;
      } else {
        filter = `proj.id = :climateActionId`;
      }
    }

    if (year !== '') {
      if (filter) {
        filter = `${filter}  and assesYr.assessmentYear = :year`;
      } else {
        filter = `assesYr.assessmentYear = :year`;
      }
    }

    if (approveStatus !== '') {
      if (approveStatus === 'approved') {
        if (filter) {
          filter = `${filter}  and assesYr.qaStatus IN (1,4)`;
        } else {
          filter = `assesYr.qaStatus IN (1,4)`;
        }
      } else {
        if (filter) {
          filter = `${filter}  and assesYr.qaStatus IS NULL`;
        } else {
          filter = `assesYr.qaStatus IS NULL`;
        }
      }
    }

    if (sectorIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and proj.sectorId = :sectorIdFromTocken`;
      } else {
        filter = `proj.sectorId = :sectorIdFromTocken`;
      }
    }

    const data = this.repo
      .createQueryBuilder('assesYr')
      .leftJoinAndSelect(
        'assesYr.assessment',
        'asse',
        'asse.id = assesYr.assessmentId',
      )
      .leftJoinAndSelect(
        'asse.project',
        'proj',
        `proj.id = asse.projectId and  proj.countryId = ${countryIdFromTocken}`,
      )
      .select([
        'asse.id',
        'assesYr.id',
        'assesYr.assessmentYear',
        'assesYr.qaStatus',
        'assesYr.verificationStatus',
        'asse.assessmentType',
        'proj.climateActionName',
        'proj.id'
      ])
      .where(filter, {
        filterText: `%${filterText}%`,
        isProposal,
        projectStatusId,
        projectApprovalStatusId,
        climateActionId: climateActionId,
        year: year,
        sectorIdFromTocken,
      })
      .orderBy('asse.editedOn', 'DESC')
      .addOrderBy('asse.createdOn', 'DESC');

    let result: AssessmentYear[] | Pagination<AssessmentYear, IPaginationMeta>
    if (getAll === 'false') {
      result = await paginate(data, options);
    } else {
      result = await data.getMany()
    }
    if (result) {
      return result;
    }
  }

  async getAssessmentYearsListInTrackCA(
    countryIdFromTocken: number,
  ): Promise<any> {

    let data = this.repo
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
