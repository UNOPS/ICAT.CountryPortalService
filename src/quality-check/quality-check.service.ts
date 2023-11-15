import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { AssessmentService } from 'src/assessment/assessment.service';
import { Assessment } from 'src/assessment/entity/assessment.entity';
import { AssessmentYear } from 'src/assessment-year/entity/assessment-year.entity';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { ParameterHistoryAction } from 'src/parameter-history/entity/parameter-history-action-history.entity';
import { ParameterHistoryService } from 'src/parameter-history/parameter-history.service';
import { Parameter } from 'src/parameter/entity/parameter.entity';
import { Project } from 'src/project/entity/project.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { QuAlityCheckStatus } from './entity/quality-check-status.entity';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
import { VerifierAcceptance } from 'src/parameter/enum/verifier-acceptance.enum';
@Injectable()
export class QualityCheckService extends TypeOrmCrudService<ParameterRequest> {
  constructor(
    @InjectRepository(ParameterRequest) repo,
    @InjectRepository(AssessmentYear)
    private readonly assessmentYearRepo: Repository<AssessmentYear>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Parameter) private parameterRepo: Repository<Parameter>,
    private assessmentservice: AssessmentService,
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
    countryIdFromTocken: number,
    ctAction: string,
  ): Promise<Pagination<AssessmentYear>> {
    let filter = `ae.qaStatus is not null`;

    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(p.climateActionName LIKE :filterText  OR as.assessmentType LIKE :filterText OR ae.AssessmentYear like :filterText OR ae.qaAssighnDate like :filterText OR ae.qaDeadline like :filterText)';
    }

    if (QAstatusId != 0) {
      filter = `${filter}  and ae.qaStatus = :QAstatusId`;
    }
    if (ctAction != null && ctAction != undefined && ctAction != '') {
      filter = `${filter}  and p.climateActionName = '${ctAction}'`;
    }
    if (NDCId != 0) {
      filter = `${filter}  and as.ndcId = :NDCId`;
    }
    if (SubNdcId != 0) {
      filter = `${filter}  and as.subNdcId = :SubNdcId`;
    }

    const data = this.assessmentYearRepo
      .createQueryBuilder('ae')
      .innerJoinAndMapOne(
        'ae.assessment',
        Assessment,
        'as',
        'ae.assessmentId = as.id',
      )
      .innerJoinAndMapOne(
        'as.project',
        Project,
        'p',
        `as.projectId = p.id and p.countryId = ${countryIdFromTocken} `,
      )

      .where(filter, {
        filterText: `%${filterText}%`,
        QAstatusId,
        NDCId,
        SubNdcId,
      })

      .orderBy('as.createdOn', 'DESC');

    const result = await paginate(data, options);

    if (result) {
      return result;
    }
  }

  async UpdateQCStatus(
    paramId: number,
    assessmentYearId: number,
    qaStatus: QuAlityCheckStatus,
    comment: string,
    userQc: string,
  ) {
    try {

      let data = this.assessmentYearRepo.createQueryBuilder('assessmentYear')
      .innerJoinAndSelect(
        'assessmentYear.assessment',
        'assessment',
        'assessmentYear.assessmentId = assessment.id'
      )
      .where('assessmentYear.id = :id', {id: assessmentYearId})

      const assessmentYear = await data.getOne()
      

      if (assessmentYear.qaStatus === QuAlityCheckStatus.Pending) {
        assessmentYear.qaStatus = QuAlityCheckStatus.InProgress;
        this.assessmentYearRepo.save(assessmentYear);
      }

      const param = new Parameter();
      param.id = paramId;
      const dataRequset = await this.repo.findOne({
        where: { parameter: param },
      });

      const originalStatus = dataRequset.qaStatus;

      if (dataRequset !== undefined && dataRequset !== null) {
        dataRequset.qaStatus = qaStatus;
        dataRequset.qaComment = comment;
        dataRequset.qcUserName = userQc;
        //@ts-ignore
        dataRequset.dataRequestStatus = qaStatus == QuAlityCheckStatus.Fail ? 30 : 11;
        dataRequset.qaStatusUpdatedDate = new Date();
        await this.repo.save(dataRequset);
      } 

      if (qaStatus === QuAlityCheckStatus.Fail){
        param.value = undefined
      }
      if (param.verifierAcceptance !== VerifierAcceptance.PENDING){
        param.verifierAcceptance = VerifierAcceptance.PENDING
      }
      await this.parameterRepo.update(param.id, param)

      let assessment = await this.assessmentservice.getAssessmentDetails(
        assessmentYear.assessment.id,
        assessmentYear.toString(),
      );

     

      this.parameterHistoryService.SaveParameterHistory(
        dataRequset.id,
        ParameterHistoryAction.QC,
        'Quality Check Status Updated to ' + QuAlityCheckStatus[qaStatus],
        comment,
        QuAlityCheckStatus[qaStatus],
        QuAlityCheckStatus[originalStatus],
      );

      return dataRequset;
    } catch (error) {
      throw error;
    }
  }
}
