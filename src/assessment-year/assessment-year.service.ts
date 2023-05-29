import { AssessmentResault } from './../assesment-resault/entity/assessment-resault.entity';
import { Assessment } from 'src/assesment/entity/assesment.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { AssessmentYear } from './entity/assessment-year.entity';
import { Project } from 'src/project/entity/project.entity';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
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
    // @InjectRepository(User)
    // public userRepo: Repository<User>,
    private readonly parameterHistoryService: ParameterHistoryService,
    private readonly userService: UsersService,
    private readonly emaiService: EmailNotificationService,
  ) {
    super(repo);
  }

  async getAllYearsByProjectId(projectId: number): Promise<any> {
    let data = this.repo
      .createQueryBuilder('ay')
      .leftJoinAndMapOne(
        'ay.assessment',
        Assessment,
        'a',
        'a.id = ay.assessmentId',
      )
      .leftJoinAndMapOne('a.Project', Project, 'p', 'a.projectId = p.id')

      //   .innerJoinAndMapOne('dr.user', User, 'u', 'dr.userId = u.id')
      .select('ay.assessmentYear as assessmentYear')
      .where('p.id=' + projectId)
      .orderBy('ay.assessmentYear', 'DESC');
    let result = await data.execute();

    return result;
  }

  async mail(id:number){
    let dataRequestItem = await this.repo.findOne({ where: { id: id } ,relations:['assessment']});
    let inscon = dataRequestItem.assessment.project.country;
    // console.log( "inscon",dataRequestItem.assessment.project.country)
    let  insSec = dataRequestItem.assessment.project.sector;
    let user:User[];

    let ins = await this.institutionRepo.findOne({ where: { country: inscon, sector: insSec, type: 2 } });
    user= await this.userService.find({where:{country:inscon,userType:5,institution:ins}});
    user.forEach((ab)=>{
      let template =
      'Dear ' +
      ab.username + ' ' +
      ' <br/> Data request with following information has shared with you.' ;
      // '<br/> parameter name -: ' + dataRequestItem.parameter.name +
      // '<br/> value -:' + dataRequestItem.parameter.value +
      // '<br> comment -: ' + updateDataRequestDto.comment;
  


  this.emaiService.sendMail(
    ab.email,
    'Accepted QC',
    '',
    template,
  );
    })
    console.log( "insSec",ins)
     
  }

  async getAssessmentByYearId(yearId: number, userName: string): Promise<any> {
    let userItem = await this.userService.findByUserName(userName);
    console.log('userItem', userItem);
    let institutionId = userItem.institution ? userItem.institution.id : 0;
    // Institution ID is not being used in the Query

    let data = this.repo
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

      //   .innerJoinAndMapOne('dr.user', User, 'u', 'dr.userId = u.id')
      /// .select('ay.assessmentYear as assessmentYear')
      .where('ay.id=' + yearId);
    //  .orderBy('ay.assessmentYear', 'DESC');
    let result = await data.getOne();
    console.log('result', result);
    return result;
  }

  async getDataForReport(
    projIds: string,
    assessTypes: string,
    yearIds: string,
  ): Promise<any> {
    // let userItem = await this.userService.findByUserName(userName);
    // console.log('userItem', userItem);
    // let institutionId = userItem.institution ? userItem.institution.id : 0;
    // Institution ID is not being used in the Query

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
      // .leftJoinAndMapOne(
      //   'pa.institution',
      //   Institution,
      //   'in',
      //   'in.id = pa.institutionId',
      // )
      .leftJoinAndMapOne('a.Project', Project, 'p', 'a.projectId = p.id')
      .leftJoinAndMapOne('p.ndc', Ndc, 'ndc', 'p.ndcId = ndc.Id')
      .leftJoinAndMapOne('a.subNdc', SubNdc, 'sndc', 'sndc.id = a.subNdcId')

      //   .innerJoinAndMapOne('dr.user', User, 'u', 'dr.userId = u.id')
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

    // .orderBy('p.climateActionName', 'DESC');

    console.log('Report', data.getSql());
    //  .orderBy('ay.assessmentYear', 'DESC');
    let result = await data.execute();
    return result;
  }


  async getDataForReportNew(
    projIds: string,
    assessTypes: string,
    yearIds: string,
    macAssesmentType: string
  ): Promise<any> {
    // let userItem = await this.userService.findByUserName(userName);
    // console.log('userItem', userItem);
    // let institutionId = userItem.institution ? userItem.institution.id : 0;
    // Institution ID is not being used in the Query
    if(macAssesmentType.length == 0 )
    {
      macAssesmentType = `''`;
    }

    if(assessTypes.length == 0 )
    {
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
      // .leftJoinAndMapOne(
      //   'a.id',
      //   AssessmentResault,
      //   'ar',
      //   'a.id = ar.assementId',
      // )
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
      // .leftJoinAndMapOne(
      //   'pa.institution',
      //   Institution,
      //   'in',
      //   'in.id = pa.institutionId',
      // )
      .leftJoinAndMapOne('a.Project', Project, 'p', 'a.projectId = p.id')
      .leftJoinAndMapOne('a.methodology', Methodology, 'meth', 'meth.id = a.methodologyId')
      .leftJoinAndMapOne('a.projectionResult', ProjectionResault, 'projResult', 'projResult.assementId = a.id')
      .leftJoinAndMapOne('p.ndc', Ndc, 'ndc', 'p.ndcId = ndc.Id')
      .leftJoinAndMapOne('a.subNdc', SubNdc, 'sndc', 'sndc.id = a.subNdcId')
      .leftJoinAndMapOne('p.projectOwner', ProjectOwner, 'powner', 'p.projectOwnerId = powner.id')
      .leftJoinAndMapOne('p.projectStatus', ProjectStatus, 'pstatus', 'p.projectStatusId = pstatus.id')



      //   .innerJoinAndMapOne('dr.user', User, 'u', 'dr.userId = u.id')
      .select(
        `distinct a.id as assesmentId,a.isProposal as isProposal, ndc.name as NDC , p.climateActionName as ClimateAction , ay.assessmentYear as Year, a.assessmentType as Type, a.baseYear as BaseYear, meth.name as MethName, p.subNationalLevl1 as SubnOne, p.subNationalLevl2 as SubnTwo, p.subNationalLevl3 as SubnThree, p.proposeDateofCommence as ProposeDateCommence,projResult.projectionYear as PrjectionYear, meth.transportSubSector as TsubSector, meth.upstream_downstream as UpDownStream, meth.ghgIncluded as GhgInc, a.baselineScenario as BaseS, ar.baselineResult as BaseR, a.projectScenario as ProjectS, ar.projectResult as ProjectR, a.lekageScenario as LeakageS, ar.lekageResult as LeakageR  , ar.totalEmission as Result , ar.macResult as MACResult, a.ghgAssessTypeForMac as TypeOfMac, a.emmisionReductionValue as EmmisionValue, sndc.name as SNDC, p.institution as Institution, powner.name as ProjectOwner, p.objective as Objective, p.projectScope as ProjectScope, p.outcome as OutCome, p.directSDBenefit as DirectB, p.indirectSDBenefit as IndreactB, pstatus.name as ProjectStatus ` )
      
      .where(
        // (
        //   `ay.verificationStatus = 7 and a.assessmentType <> 'MAC' AND ay.id IN(` +
        //   yearIds +
        //   ' ) AND a.assessmentType IN(' +
        //   assessTypes +
        //   ') AND p.id IN(' + projIds +
        //   ')'
        // ) + 
        // ' OR '
        // +
        //   (
        //     `ay.verificationStatus = 7 and a.assessmentType = 'MAC' AND ay.id IN (` + yearIds +
        //     ') AND a.ghgAssessTypeForMac IN (' + macAssesmentType +
        //     ') AND p.id IN (' + projIds + ')'
        //   )
 
        //filter from project ID is useless year id taken from those project
        (
          `ay.verificationStatus = 7 and a.assessmentType <> 'MAC' AND ay.id IN(` +
          yearIds +
          ' ) AND a.assessmentType IN(' +
          assessTypes +
          ') '
        ) + 
        ' OR '
        +
          (
            `ay.verificationStatus = 7 and a.assessmentType = 'MAC' AND ay.id IN (` + yearIds +
            ') AND a.ghgAssessTypeForMac IN (' + macAssesmentType +
            ') '
          )
      )
      //.groupBy('ay.assessmentYear')
      //.groupBy('a.assessmentType')
      // .groupBy('p.climateActionName')
      // .groupBy('ndc.name')
      //.groupBy('a.ghgAssessTypeForMac')
      .orderBy('a.assessmentType', 'ASC')
      .orderBy('ay.assessmentYear', 'ASC')
      .orderBy('p.climateActionName', 'ASC')
      .orderBy('ndc.name', 'ASC');

    // .orderBy('p.climateActionName', 'DESC');

    console.log('Report', data.getSql());
    //  .orderBy('ay.assessmentYear', 'DESC');
    let result = await data.execute();
    return result;
  }


  async getDataForParameterReportNew(
    projIds: string,
    assessTypes: string,
    yearIds: string,
    macAssesmentType: string
  ): Promise<any> {
    // let userItem = await this.userService.findByUserName(userName);
    // console.log('userItem', userItem);
    // let institutionId = userItem.institution ? userItem.institution.id : 0;
    // Institution ID is not being used in the Query
    if(macAssesmentType.length == 0 )
    {
      macAssesmentType = `''`;
    }

    if(assessTypes.length == 0 )
    {
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
      // .leftJoinAndMapOne(
      //   'pa.institution',
      //   Institution,
      //   'in',
      //   'in.id = pa.institutionId',
      // )
      .leftJoinAndMapOne('a.Project', Project, 'p', 'a.projectId = p.id')
      .leftJoinAndMapOne('a.methodology', Methodology, 'meth', 'meth.id = a.methodologyId')
      .leftJoinAndMapOne('a.projectionResult', ProjectionResault, 'projResult', 'projResult.assementId = a.id')
      .leftJoinAndMapOne('p.ndc', Ndc, 'ndc', 'p.ndcId = ndc.Id')
      .leftJoinAndMapOne('a.subNdc', SubNdc, 'sndc', 'sndc.id = a.subNdcId')

      //   .innerJoinAndMapOne('dr.user', User, 'u', 'dr.userId = u.id')
      .select(
        `distinct a.id as assesmentId, ndc.name as NDC , p.climateActionName as ClimateAction , ay.assessmentYear as Year, a.assessmentType as Type, a.baseYear as BaseYear, meth.name as MethName, p.subNationalLevl1 as SubnOne, p.subNationalLevl2 as SubnTwo, p.subNationalLevl3 as SubnThree, p.proposeDateofCommence as ProposeDateCommence,projResult.projectionYear as PrjectionYear, meth.transportSubSector as TsubSector, meth.upstream_downstream as UpDownStream, meth.ghgIncluded as GhgInc, a.baselineScenario as BaseS, ar.baselineResult as BaseR, a.projectScenario as ProjectS, ar.projectResult as ProjectR, a.lekageScenario as LeakageS, ar.lekageResult as LeakageR  , ar.totalEmission as Result , ar.macResult as MACResult, a.ghgAssessTypeForMac as TypeOfMac, a.emmisionReductionValue as EmmisionValue, CASE    WHEN pa.isBaseline THEN 'Baseline'    WHEN pa.isProject THEN 'Project'    WHEN pa.isLekage THEN 'Lekage'   END AS ParaType,pa.name as KeyIndicator, pa.value as ParaValue, pa.uomDataRequest as ParaUnit` )//pa.name as KeyIndicator, pa.value as ParaValue, pa.uomDataRequest as ParaUnit',
      
      .where(
        (
          `ay.verificationStatus = 7 and a.assessmentType <> 'MAC' AND ay.id IN(` +
          yearIds +
          ' ) AND a.assessmentType IN(' +
          assessTypes +
          ') AND p.id IN(' + projIds +
          ')'
        ) + 
        ' OR '
        +
          (
            `ay.verificationStatus = 7 and a.assessmentType = 'MAC' AND ay.id IN (` + yearIds +
            ') AND a.ghgAssessTypeForMac IN (' + macAssesmentType +
            ') AND p.id IN (' + projIds + ')'
          )
      )
      //.groupBy('ay.assessmentYear')
      //.groupBy('a.assessmentType')
      // .groupBy('p.climateActionName')
      // .groupBy('ndc.name')
      //.groupBy('a.ghgAssessTypeForMac')
      .orderBy('a.assessmentType', 'ASC')
      .orderBy('ay.assessmentYear', 'ASC')
      .orderBy('p.climateActionName', 'ASC')
      .orderBy('ndc.name', 'ASC');

    // .orderBy('p.climateActionName', 'DESC');

    console.log('Report', data.getSql());
    //  .orderBy('ay.assessmentYear', 'DESC');
    let result = await data.execute();
    return result;
  }

  async getAssessmentForAssignVerifiers(
    options: IPaginationOptions,
    filterText: string,
    QAstatusId: number,
    countryIdFromTocken:number
  ): Promise<any> {
    let data = this.repo
      .createQueryBuilder('ay')
      .innerJoinAndMapOne(
        'ay.assessment',
        Assessment,
        'a',
        'a.id = ay.assessmentId',
      )
      .innerJoinAndMapOne('a.Project', Project, 'p', `a.projectId = p.id and p.countryId = ${countryIdFromTocken}`)

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

    console.log('AssessmentFor Verifier', data.getSql());

    let result = await paginate(data, options);
    return result;
  }

  async getAllYearsByAssessmentId(assesmentId: number): Promise<any> {
    console.log(assesmentId);

    let data = this.repo
      .createQueryBuilder('ay')
      // .leftJoinAndMapOne(
      //   'ay.assessment',
      //   Assessment,
      //   'a',
      //   'a.id = ay.assessmentId',
      // )
      .where('ay.assessmentId = ' + assesmentId);

    console.log(data.getQueryAndParameters());

    let result = await data.getRawMany();

    return result;
  }

  async acceptDataVerifiersForIds(
    updateDataRequestDto: DataVerifierDto,
  ): Promise<boolean> {
    // let dataRequestItemList = new Array<ParameterRequest>();

    for (let index = 0; index < updateDataRequestDto.ids.length; index++) {
      const id = updateDataRequestDto.ids[index];
      let dataRequestItem = await this.repo.findOne({ where: { id: id } });
      let originalStatus = dataRequestItem.verificationStatus;
      // dataRequestItem.verificationStatus = updateDataRequestDto.status;
      dataRequestItem.verificationDeadline = updateDataRequestDto.deadline;
      dataRequestItem.verificationUser = updateDataRequestDto.userId;

      let user=await this.userService.findOne({where:{id:updateDataRequestDto.userId}});
      // let user = await this.userRepo.findOne({where:{id:updateDataRequestDto.userId}})
      var template: any;
        template =
          'Dear ' +
          user.firstName + ' ' + user.lastName+
          ' <br/> Data request with following information has shared with you.' +
          // '<br/> parameter name -: ' + dataRequestItem.parameter.name +
          // '<br/> value -:' + dataRequestItem.parameter.value +
          // '<br> comment -: ' + updateDataRequestDto.comment;
      
          this.emaiService.sendMail(
            user.email,
            'Assign verifier',
            '',
            template,
          );
      // dataRequestItemList.push(dataRequestItem);
      this.repo.save(dataRequestItem).then((res) => {
        console.log('res', res);
        // this.parameterHistoryService.SaveParameterHistory(
        //   res.id,
        //   ParameterHistoryAction.AssignVerifier,
        //   'AssignVerifier',
        //   '',
        //   res.verificationStatus.toString(),
        //   originalStatus.toString(),
        // );
      });
    }

    // this.repo.save(dataRequestItemList);

    return true;
  }

  async acceptQC(updateDataRequestDto: DataVerifierDto): Promise<boolean> {
    // let dataRequestItemList = new Array<ParameterRequest>();
   let insSec: any;
   let inscon: any;

    for (let index = 0; index < updateDataRequestDto.ids.length; index++) {
      const id = updateDataRequestDto.ids[index];
      let dataRequestItem = await this.repo.findOne({ where: { id: id } ,relations:['assessment']});
      console.log('dataRequestItem', dataRequestItem);
      let originalStatus = dataRequestItem.qaStatus;
      dataRequestItem.qaStatus = updateDataRequestDto.status;


     inscon = dataRequestItem.assessment.project.country;
     console.log( "inscon",dataRequestItem.assessment.project.country)
     insSec = dataRequestItem.assessment.project.sector;
     console.log( "insSec",insSec)

      // dataRequestItemList.push(dataRequestItem);
      this.repo.save(dataRequestItem).then((res) => {
        console.log('res', res);
        // this.parameterHistoryService.SaveParameterHistory(
        //   res.id,
        //   ParameterHistoryAction.QC,
        //   'QC',
        //   '',
        //   res.qaStatus.toString(),
        //   originalStatus.toString(),
        // );
      });
    }
    let user:User[];
   let ins = await this.institutionRepo.findOne({ where: { country: inscon, sector: insSec, type: 2 } });
   user= await this.userService.find({where:{country:inscon,userType:7,institution:ins}})
   user.forEach((ab)=>{
    console.log("=========", ins)
    var template: any;
    if (updateDataRequestDto.comment != undefined) {
      template =
        'Dear ' +
        ab.username + ' ' +
        ' <br/> Data request with following information has shared with you.' +
        // '<br/> parameter name -: ' + dataRequestItem.parameter.name +
        // '<br/> value -:' + dataRequestItem.parameter.value +
        '<br> comment -: ' + updateDataRequestDto.comment;
    }
    else {
      template =
        'Dear ' + ab.username + ' ' +
        ' <br/>Data request with following information has shared with you.'
      // '<br/> parameter name -: ' + dataRequestItem.parameter.name +
      // '<br/> value -:' + dataRequestItem.parameter.value;
    }


    this.emaiService.sendMail(
      ab.email,
      'Please verify',
      '',
      template,
    );
   })
    

    // this.repo.save(dataRequestItemList);

    return true;
  }

  async getVerificationDetails(
    assessmentId: number,
    assementYear: string,
  ): Promise<any> {
    let filter: string =
      'ass.id = :assessmentId and assYear.assessmentYear = :assementYear';

    // if (
    //   assementYear != undefined &&
    //   assementYear != null &&
    //   assementYear != ''
    // ) {
    //   filter = filter + ' and pa.AssessmentYear = :assementYear';
    // }

    var data = this.repo
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

      /*
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
*/
      .where(filter, {
        assessmentId,
        assementYear,
      });

    // console.log('data.....',data)
    // console.log('query...', data.getQueryAndParameters());
    return await data.getMany();
  }

  async getdetailsByAssessmentYearAndProjNameAndAsseType(
    assessmentType: string,
    assementYear: string,
    climateActionName: string,
  ): Promise<any> {
    let filter: string =
      'ass.assessmentType = :assessmentType and assYear.assessmentYear = :assementYear and pr.climateActionName = :climateActionName';

    // if (
    //   assementYear != undefined &&
    //   assementYear != null &&
    //   assementYear != ''
    // ) {
    //   filter = filter + ' and pa.AssessmentYear = :assementYear';
    // }

    var data = this.repo
      .createQueryBuilder('assYear')
      .leftJoinAndMapOne(
        'assYear.assessment',
        Assessment,
        'ass',
        'ass.id = assYear.assessmentId',
      )
      .leftJoinAndMapOne('ass.project', Project, 'pr', 'pr.id = ass.projectId')

      /*
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
*/
      .where(filter, {
        assessmentType,
        assementYear,
        climateActionName,
      });

    // console.log('data.....',data)
    //console.log('query...', data.getQueryAndParameters());
    return await data.getOne();
  }

  async getYearListByAssessmentId(id: number): Promise<AssessmentYear[]> {
    console.log(id);

    let assement = new Assessment();
    assement.id = id;
    return await this.repo.find({ where: { assessment: assement } });
  }



  async getAssessmentYearsForCountryAndSectorAdmins(options: IPaginationOptions,
    isPost:number,
    sectorId:number,
    countryIdFromTocken:number,
    sectorIdFromTocken:number,
   
    ): Promise<any>{
    

    // let filter: string = 'asse.isProposal = 0 ';
    let filter: string = '';

    
    if (isPost==0) {
      console.log('ispost1',isPost)
      if (filter) {
        filter = `${filter}  and asse.ghgAssessTypeForMac = 'ex-post' `;
      } else {
        filter = `asse.ghgAssessTypeForMac = 'ex-post' `;
      }
    }else{
      // console.log('ispost2',isPost)
      if (filter) {
        filter = `${filter}  and asse.ghgAssessTypeForMac = 'ex-ante'`;
      } else {
        filter = `asse.ghgAssessTypeForMac = 'ex-ante'`;
      }


    }

    console.log("context",countryIdFromTocken)
    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and pro.countryId = :countryIdFromTocken`;
      } else {
        filter = `pro.countryId = :countryIdFromTocken`;
      }
    }

if(sectorIdFromTocken){ 
  // console.log('sectorIdFromTocken')
  if (filter) {
    filter = `${filter}  and pro.sectorId = :sectorIdFromTocken  `;
  } else {
    filter = `pro.sectorId = :sectorIdFromTocken`; 
}}

else{
 
  if(sectorId!=0){
   
    if (filter) {
      // console.log('sectorId1',sectorId)
      filter = `${filter}  and pro.sectorId = :sectorId`;
    } else {
      // console.log('sectorId2',sectorId)
      filter = `pro.sectorId = :sectorId`;
    }
  }


}
   



    let data = this.repo
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
      //  .leftJoinAndMapOne(
      //   'asseYr.assessmentResault',
      //   AssessmentResault,
      //   'asseRslt',
      //   'asseYr.id= asseRslt.assessmentYearId',
      // )
     
      .select([
        'asseYr.assessmentYear',
        'asse.id',
        'asse.emmisionReductionValue',
        'asse.macValue',
        'pro.climateActionName',
        'asse.ghgAssessTypeForMac'
        // 'asseRslt.macResult',
        // 'asseRslt.totalEmission'
        
      ])
      .where(filter, {
        countryIdFromTocken,
        sectorIdFromTocken,
        sectorId
      
        
      })
      // .groupBy('asse.ghgAssessTypeForMac')
      .orderBy('asseYr.createdOn', 'ASC') ;
      // console.log('quer',data.getSql())
      let result = await paginate(data, options);
   
       if (result) {
        // console.log("resu",result);
         return result;
       }

  }


  async getAssessmentYearsWiseMacGraphDataToSummeryReport(options: IPaginationOptions,
    isPost:number,
    sectorId:number,
    countryIdFromTocken:number,
    sectorIdFromTocken:number,
    assementYears:number[],
    assementType:string[],
    projectId:string[]
    ): Promise<any>{
    
 // let filter: string = 'asse.isProposal = 0 ';
    let filter: string = '';
    if (isPost==0) {
      console.log('ispost1',isPost)
      if (filter) {
        filter = `${filter}  and asse.ghgAssessTypeForMac = 'ex-post' `;
      } else {
        filter = `asse.ghgAssessTypeForMac = 'ex-post' `;
      }
    }else{
      // console.log('ispost2',isPost)
      if (filter) {
        filter = `${filter}  and asse.ghgAssessTypeForMac = 'ex-ante'`;
      } else {
        filter = `asse.ghgAssessTypeForMac = 'ex-ante'`;
      }


    }






    // if (isPost==true) {
    //   // console.log('ispost1',isPost)
    //   if (filter) {
    //     filter = `${filter}  and asse.ghgAssessTypeForMac = 'ex-post' `;
    //   } else {
    //     filter = `asse.ghgAssessTypeForMac = 'ex-post' `;
    //   }
    // }else{
    //   // console.log('ispost2',isPost)
    //   if (filter) {
    //     filter = `${filter}  and asse.ghgAssessTypeForMac = 'ex-ante'`;
    //   } else {
    //     filter = `asse.ghgAssessTypeForMac = 'ex-ante'`;
    //   }


    // }


    if(assementYears && assementYears.length>0){
      if (filter) {
        filter = `${filter}  and asseYr.assessmentYear IN (:...assementYears) `;
      } else {
        filter=' asseYr.assessmentYear IN (:...assementYears)  ';
      }
    
    }
    if(assementType && assementType.length>0){
      if (filter) {
        filter = `${filter}  and asse.assessmentType IN (:...assementType) `;
      } else {
        filter=' asse.assessmentType IN (:...assementType)  ';
      }
    ;
    }
    if(projectId && projectId.length>0){
      if (filter) {
        filter = `${filter}  and  pro.id IN (:...projectId) `;
      } else {
        filter='  pro.id IN (:...projectId)  ';
      }
    ;
    }


    console.log("context",countryIdFromTocken)
    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and pro.countryId = :countryIdFromTocken`;
      } else {
        filter = `pro.countryId = :countryIdFromTocken`;
      }
    }

    if (sectorIdFromTocken) {
      // console.log('sectorIdFromTocken')
      if (filter) {
        filter = `${filter}  and pro.sectorId = :sectorIdFromTocken  `;
      } else {
        filter = `pro.sectorId = :sectorIdFromTocken`;
      }
    }

    else {

      if (sectorId != 0) {

        if (filter) {
          // console.log('sectorId1',sectorId)
          filter = `${filter}  and pro.sectorId = :sectorId`;
        } else {
          // console.log('sectorId2',sectorId)
          filter = `pro.sectorId = :sectorId`;
        }
      }


    }




    let data = this.repo
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
      // .leftJoinAndMapOne(
      //   'asseYr.assessmentResault',
      //   AssessmentResault,
      //   'asseRslt',
      //   'asseYr.id= asseRslt.assessmentYearId',
      // )

      .select([
        'asseYr.assessmentYear',
        'asse.id',
        'asse.emmisionReductionValue',
        'asse.macValue',
        'pro.climateActionName',
        // 'asseRslt.macResult',
        // 'asseRslt.totalEmission'

      ])
      .where(filter, {
        countryIdFromTocken,
        sectorIdFromTocken,
        sectorId,
        assementYears,
        assementType,
        projectId
        
      })
      // .groupBy('asseYr.assessmentYear')
      .orderBy('asseYr.createdOn', 'ASC');
    // console.log('quer',data.getSql())
    let result = await paginate(data, options);

    if (result) {
      // console.log("resu",result);
      return result;
    }

  }

  async getAssessmentByYearAndProjectId(
    year: string,
    projectId: number,
  ): Promise<any> {
    let filter: string = '';
    let type:any = 'MAC'
    let stage:any = 0
    filter = `asseYear.assessmentYear = :year and pr.id = :projectId and asse.assessmentType != :type and asse.isProposal = :stage `;
   

   let data = this.repo
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
     .where(filter, {year,projectId,type,stage})
     
     
   

   let resualt = await data.getOne();
   
   if (resualt) {
   
     return resualt;
   }
   

}

async assessmentYearForManageDataStatus(
  options: IPaginationOptions,
  filterText: string,
  projectStatusId: number,
  projectApprovalStatusId: number,
  // assessmentStatusName: string,
  // Active: number,
 // countryId: number,
  //sectorId: number,
  isProposal: number,
  countryIdFromTocken: number,
  sectorIdFromTocken:number,

): Promise<any> {

  let filter: string = '';
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

  

  // if (countryId != 0) {
  //   if (filter) {
  //     filter = `${filter}  and proj.countryId = :countryId`;
  //   } else {
  //     filter = `proj.countryId = :countryId`;
  //   }
  // }

  if (sectorIdFromTocken != 0) {
    if (filter) {
      filter = `${filter}  and proj.sectorId = :sectorIdFromTocken`;
    } else {
      filter = `proj.sectorId = :sectorIdFromTocken`;
    }
  }
  let select: string[];






  let data = this.repo
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
      'assesYr.verificationStatus',
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
    //  countryId,
     // sectorId,
     sectorIdFromTocken,
    })
    .orderBy('asse.createdOn', 'DESC');

  console.log(
    '=====================================================================',
  );

  // console.log("query",data.getQuery())
  let resualt = await paginate(data, options);
  // console.log('my result...', resualt);
  if (resualt) {
    console.log('results for manage..', resualt);
    return resualt;
  }
}


async getAssessmentYearsListInTrackCA(

  countryIdFromTocken:number,
  ): Promise<any> {

    let data = this.repo
      .createQueryBuilder('asseYear')
      .leftJoinAndMapOne(
        'asseYear.Assessment',
        Assessment,
        'ass',
        'asseYear.assessmentId = ass.id',
      ).innerJoinAndMapOne(
        'ass.Project',
        Project,
        'pro',
        `ass.projectId = pro.id and pro.countryId = ${countryIdFromTocken}`,
      );
      // .leftJoinAndMapOne(
      //   'para.DataRequest',
      //   ParameterRequest,
      //   'paraReq',
      //   'para.id = paraReq.ParameterId',  //and paraReq.dataRequestStatus = 2
      // )
      // .where('paraReq.dataRequestStatus = ' + 6);

    let result = await data.getMany();

    return result;
  }





}
