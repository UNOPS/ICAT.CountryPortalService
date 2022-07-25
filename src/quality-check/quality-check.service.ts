import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { AssesmentService } from 'src/assesment/assesment.service';
import { Assessment } from 'src/assesment/entity/assesment.entity';
import { AssessmentYear } from 'src/assessment-year/entity/assessment-year.entity';
import { DataRequestStatus } from 'src/data-request/entity/data-request-status.entity';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { ParameterHistoryAction } from 'src/parameter-history/entity/paeameter-history-action-history.entity';
import { ParameterHistory } from 'src/parameter-history/entity/parameter-history.entity';
import { ParameterHistoryService } from 'src/parameter-history/parameter-history.service';
import { Parameter } from 'src/parameter/entity/parameter.entity';
import { Project } from 'src/project/entity/project.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { QuAlityCheckStatus } from './entity/quality-check-status.entity';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
@Injectable()
export class QualityCheckService extends TypeOrmCrudService<ParameterRequest> {
  constructor(
    @InjectRepository(ParameterRequest) repo,
    @InjectRepository(AssessmentYear)
    private readonly assessmentYearRepo: Repository<AssessmentYear>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private assesmentservice: AssesmentService,
    public parameterHistoryService: ParameterHistoryService,
    private readonly tokenDetails:TokenDetails,
    
  ) {
    super(repo);
  }

  async GetQCParameters(
    options: IPaginationOptions,
    filterText: string,
    QAstatusId: number,
    NDCId: number,
    SubNdcId: number,
    countryIdFromTocken:number,
  ): Promise<Pagination<AssessmentYear>> {
    // let filter: string = `dataRequestStatus in (${DataRequestStatus.QA_Assign.valueOf()},${DataRequestStatus.QAPass.valueOf()},${DataRequestStatus.QAFail.valueOf()})`;
    let filter: string = `ae.qaStatus is not null`;

    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(p.climateActionName LIKE :filterText  OR as.assessmentType LIKE :filterText OR ae.AssessmentYear like :filterText OR ae.qaAssighnDate like :filterText OR ae.qaDeadline like :filterText)';
    }

    if (QAstatusId != 0) {
      filter = `${filter}  and ae.qaStatus = :QAstatusId`;
    }
    if (NDCId != 0) {
      filter = `${filter}  and as.ndcId = :NDCId`;
    }
    if (SubNdcId != 0) {
      filter = `${filter}  and as.subNdcId = :SubNdcId`;
    }

    let data = this.assessmentYearRepo
      .createQueryBuilder('ae')
      .innerJoinAndMapOne(
        'ae.assessment',
        Assessment,
        'as',
        'ae.assessmentId = as.id',  //`a.projectId = p.id and p.countryId = ${countryIdFromTocken}`
      )
      .innerJoinAndMapOne('as.project', Project, 'p', `as.projectId = p.id and p.countryId = ${countryIdFromTocken}`)

      .where(filter, {
        filterText: `%${filterText}%`,
        QAstatusId,
        NDCId,
        SubNdcId,
      })
      // .groupBy('ae.Assessmentid')
      //  .groupBy('ae.AssessmentYear')
      .orderBy('as.createdOn', 'DESC');
    // console.log(
    //   '=====================================================================',
    // );
    console.log(data.getQuery());

    let resualt = await paginate(data, options);

    if (resualt) {
      return resualt;
    }
  }

  async UpdateQCStatus(
    paramId: number,
    assementYearId: number,
    qaStatus: QuAlityCheckStatus,
    comment: string,
    userQc:string,
  ) {
    try {

     // let userObj = await this.userRepo.findOne({ }userQc);
     // console.log("my user...",userObj);

      let assementYear = await this.assessmentYearRepo.findOne(assementYearId, {
        relations: ['assessment'],
      });

      
     

      if (assementYear.qaStatus === QuAlityCheckStatus.Pending) {
        assementYear.qaStatus = QuAlityCheckStatus.InProgress;
        this.assessmentYearRepo.save(assementYear);
      }

      let param = new Parameter();
      param.id = paramId;
      let dataRequset = await this.repo.findOne({
        where: { parameter: param },
      });

      let originalStatus = dataRequset.qaStatus;

      if (dataRequset !== undefined && dataRequset !== null) {
        dataRequset.qaStatus = qaStatus;
        dataRequset.qaComment = comment;
        dataRequset.qcUserName = userQc;
        dataRequset.dataRequestStatus=qaStatus==QuAlityCheckStatus.Fail? 30:11;
        dataRequset.qaStatusUpdatedDate = new Date();
        var dataRequestTo = dataRequset;
        await this.repo.save(dataRequset);
      }

      let assesment = await this.assesmentservice.getAssessmentDetails(
        assementYear.assessment.id,
        assementYearId.toString(),
      );

     

      this.parameterHistoryService.SaveParameterHistory(
        dataRequset.id,
        ParameterHistoryAction.QC,
        'Quality Check Status Updated to ' + QuAlityCheckStatus[qaStatus],
        comment,
        QuAlityCheckStatus[qaStatus],
        QuAlityCheckStatus[originalStatus],
      );

      return dataRequestTo;
    } catch (error) {
      throw error;
    }
  }
}
