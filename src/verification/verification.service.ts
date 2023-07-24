import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
import { DataRequestStatus } from 'src/data-request/entity/data-request-status.entity';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { Institution } from 'src/institution/institution.entity';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { ParameterHistoryAction } from 'src/parameter-history/entity/parameter-history-action-history.entity';
import { ParameterHistoryService } from 'src/parameter-history/parameter-history.service';
import { Parameter } from 'src/parameter/entity/parameter.entity';
import { Project } from 'src/project/entity/project.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { VerificationDetail } from './entity/verification-detail.entity';
import { VerifierAcceptance } from 'src/parameter/enum/verifier-acceptance.enum';
import { ResposeDto } from './dto/response.dto';
import { QuAlityCheckStatus } from 'src/quality-check/entity/quality-check-status.entity';
import { VerificationStatus } from './entity/verification-status.entity';
import { AssessmentResult } from 'src/assessment-result/entity/assessment-result.entity';

@Injectable()
export class VerificationService extends TypeOrmCrudService<ParameterRequest> {
  constructor(
    @InjectRepository(ParameterRequest) repo,
    @InjectRepository(AssessmentYear)
    private readonly assessmentYearRepo: Repository<AssessmentYear>,
    @InjectRepository(VerificationDetail)
    private readonly verificationDetailRepo: Repository<VerificationDetail>,
    @InjectRepository(Institution)
    public institutionRepo: Repository<Institution>,
    @InjectRepository(User)
    public userRepo: Repository<User>,
    @InjectRepository(ParameterRequest)
    private readonly ParameterRequestRepo: Repository<ParameterRequest>,
    private assessmentservice: AssessmentService,
    @InjectRepository(Parameter)
    private parameterRepo: Repository<Parameter>,
    @InjectRepository(AssessmentResult)
    private assessmentResultRepo: Repository<AssessmentResult>,
    public parameterHistoryService: ParameterHistoryService,
    private readonly emaiService: EmailNotificationService,
  ) {
    super(repo);
  }

  async GetVRParameters(
    options: IPaginationOptions,
    filterText: string,
    VRstatusId: number,
    countryIdFromTocken: number,
    isHistory: string
  ): Promise<Pagination<AssessmentYear>> {
    let filter = `ae.verificationStatus is not null`;

    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(p.climateActionName LIKE :filterText  OR as.assessmentType LIKE :filterText OR ae.AssessmentYear like :filterText OR ae.editedOn  like :filterText OR ae.verificationDeadline  like :filterText OR ae.verificationStatus  like :filterText)';
    }

    if (VRstatusId != 0) {
      filter = `${filter}  and ae.verificationStatus = :VRstatusId`;
    } else {
      if (isHistory && isHistory !== 'false') {
        filter = `${filter}  and ae.verificationStatus = 6 or ae.verificationStatus = 7`;
      }
    }
    let data = this.assessmentYearRepo
      .createQueryBuilder('ae')
      .innerJoinAndMapOne(
        'ae.assessment',
        Assessment,
        'as',
        'ae.assessmentId = as.id',  
      )

      .where(filter, {
        filterText: `%${filterText}%`,
        VRstatusId,
      })
      .orderBy('ae.qaDeadline', 'DESC');

    const result = await paginate(data, options);

    if (result) {
      return result;
    }
  }

  async GetVerifierParameters(
    options: IPaginationOptions,
    filterText: string,
    VRstatusId: number,
    countryIdFromTocken: number,
    userNameFromTocken: any,
  ): Promise<Pagination<AssessmentYear>> {
    let filter = `ae.verificationStatus is not null`;
    const user = await this.userRepo.findOne({
      where: { username: userNameFromTocken },
    });

    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(p.climateActionName LIKE :filterText  OR as.assessmentType LIKE :filterText OR ae.AssessmentYear like :filterText OR ae.editedOn  like :filterText OR ae.verificationDeadline  like :filterText OR ae.verificationStatus  like :filterText)';
    }

    if (VRstatusId != 0) {
      filter = `${filter}  and ae.verificationStatus = :VRstatusId`;
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
        `as.projectId = p.id and p.countryId = ${countryIdFromTocken}`,
      )

      .where(
        filter + filter + " AND ae.verificationUser =" + user.id,
        {
          filterText: `%${filterText}%`,
          VRstatusId,
        },
      );
    const result = await paginate(data, options);

    if (result) {
      return result;
    }
  }

  async SaveVerificationDetail(verificationDetail: VerificationDetail[]) {
    try {
      this.verificationDetailRepo.save(verificationDetail);

      const ass = verificationDetail[0].assessmentYear.id;

      const asseYa = await this.assessmentYearRepo.findOne({
        where: { id: ass },
      });
      const assessment = await this.assessmentservice.findOne({
        where: { id: verificationDetail[0].assessmentId },
      });

      const inscon = assessment.project.country;
      const insSec = assessment.project.sector;
      const ins = await this.institutionRepo.findOne({
        where: { country: inscon, sector: insSec, type: 2 },
      });
      const user: User[] = await this.userRepo.find({
        where: { country: inscon, userType: 5, institution: ins },
      });

      user.forEach((ab) => {
        const template =
          'Dear ' +
          ab.username +
          ' ' +
          '<br/>Data request with following information has shared with you.' +
          ' <br/> Accepted Verifir value' +
          '<br> project -: ' +
          asseYa.assessment.project.climateActionName;

        this.emaiService.sendMail(ab.email, 'Accepted parameter', '', template);
      });

      verificationDetail.map(async (a) => {
        if (a.parameter) {
          let description = '';
          let comment = '';

          if (a.verificationStage == 1) {
            if (a.isAccepted) {
              description = 'Verifier Accepted.';
            }

            if (a.explanation) {
              description = 'Verifier raised concern.';
              comment = a.rootCause;
            }
          }
          let dataRequest = await this.ParameterRequestRepo.findOne({
            where: { parameter: a.parameter },
          });
          let para = await this.parameterRepo.findOne({ id: a.parameter.id })
          if (!para.isDefault && !para.isHistorical) {
            this.parameterHistoryService.SaveParameterHistory(
              dataRequest.id,
              ParameterHistoryAction.RaisedConcern,
              'Verifier - Concern  raised',
              dataRequest.noteDataRequest,
              dataRequest.dataRequestStatus.toString(),
              dataRequest.dataRequestStatus.toString(),
            );
          }

          let data = this.ParameterRequestRepo
            .createQueryBuilder('paraReq')
            .innerJoinAndMapOne(
              'paraReq.parameter',
              Parameter,
              'para',
              `paraReq.ParameterId = para.id and para.id = ${a.parameter.id}`,
            )

          let result1 = await data.getOne();

          if (a.id == undefined && a.isDataRequested == true) {
            let dataRequest = await this.ParameterRequestRepo.findOne({
              where: { parameter: a.parameter },
            });
            dataRequest.dataRequestStatus =
              DataRequestStatus.Verifier_Data_Request;
            await this.ParameterRequestRepo.save(dataRequest);
          }
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async GetVerificationDetails(
    assessmentYearId: number,
  ): Promise<VerificationDetail[]> {
    const data = this.verificationDetailRepo
      .createQueryBuilder('vd')
      .leftJoinAndMapOne(
        'vd.parameter',
        Parameter,
        'p',
        'vd.parameterId = p.id',
      )
      .where('vd.assessmentYearId = :assessmentYearId', { assessmentYearId });

    let resualt = data.getMany();

    if (resualt) {
      return resualt;
    }
  }

  async ChangeParameterValue(
    parameter: Parameter,
    isDataEntered: boolean,
    concern: string,
    correctData: any,
    user: User,
    isDefault: boolean,
    isHistorical: boolean
  ) {
    /**
     * Steps:
     * 1. Set status (verifierAcceptance) in existing parameter as 'REJECTED'
     * 2. Send new parameter request. Save verifier concern and previous parameter id as parent parameter id.
     * 3. Update assessment status into the initial statuses (verification status and qastatus)
     * 
     * Additional: 
     * Load parameters in DC and QC which are not isVerifierAccepted = true or verifierAcceptance REJECTED or ACCEPTED.
     * 
     * However the NC report need to be submitted to go for the next level of verification
     */
    let response = new ResposeDto()
    let res

    try {
      parameter = await this.parameterRepo.createQueryBuilder('para')
        .innerJoinAndSelect(
          'para.assessment',
          'assessment',
          'assessment.id = para.assessmentId'
        )
        .leftJoinAndSelect(
          'para.institution',
          'institution',
          'institution.id = para.institutionId'
        )
        .where('para.id = :id', { id: parameter.id })
        .getOne()
      parameter.verifierAcceptance = VerifierAcceptance.REJECTED
      parameter.verifierConcern = concern

      let oldDatarqst=await this.ParameterRequestRepo.findOne({where:{parameter:parameter}})


      if (isDataEntered) {
        //direct data enter

        if (isDefault){
          //handle default
          let newPara = new Parameter()
          newPara = { ...parameter }
          newPara.id = undefined
          newPara.value = correctData.defaultValue.value
          newPara.conversionValue = correctData.defaultValue.value
          newPara.defaultValue = correctData.defaultValue
          newPara.defaultValueId = correctData.defaultValue.id
          newPara.uomDataEntry = correctData.unit
          newPara.previouseParameterId = parameter.id
          newPara.verifierAcceptance = VerifierAcceptance.DATA_ENTERED

          res = await this.parameterRepo.save([parameter, newPara])

        } else if (isHistorical){
          //handle historical value
          let newPara = new Parameter()
          newPara = { ...parameter }
          newPara.id = undefined
          newPara.value = correctData.historicalValue.value
          newPara.conversionValue = correctData.historicalValue.value
          newPara.isHistorical = true
          newPara.uomDataEntry = correctData.unit
          newPara.previouseParameterId = parameter.id
          newPara.verifierAcceptance = VerifierAcceptance.DATA_ENTERED

          res = await this.parameterRepo.save([parameter, newPara])
        } else {
          let newPara = new Parameter()
          newPara = { ...parameter }
          newPara.id = undefined
          newPara.value = correctData.value
          newPara.conversionValue = correctData.value
          newPara.uomDataEntry = correctData.unit
          newPara.verifierAcceptance = VerifierAcceptance.DATA_ENTERED
          newPara.previouseParameterId = parameter.id
  
          res = await this.parameterRepo.save([parameter, newPara])
  
          let request = new ParameterRequest()
          request.parameter = newPara
          request.dataRequestStatus = DataRequestStatus.Data_Reviewed
          request.UserDataEntry = user.id 
  
          let req = await this.ParameterRequestRepo.save(request);

     
            this.parameterHistoryService.SaveParameterHistory(
              req.id,
              ParameterHistoryAction.EnterData,
              'Sector admin - Revised the value',
              req.noteDataRequest,
              req.dataRequestStatus.toString(),
              oldDatarqst?.dataRequestStatus.toString(),
            );
          let assessmentYear = await this.assessmentYearRepo.find(
            {
              where: { assessment: { id: parameter.assessment.id } },
              relations: ['assessment']
            }
          )
          assessmentYear[0].verificationStatus = VerificationStatus.AssessmentReturned
          assessmentYear[0].qaStatus = undefined
          assessmentYear[0].qaDeadline = undefined
  
          let asy = await this.assessmentYearRepo.update(assessmentYear[0].id, assessmentYear[0])
  
          let assessmentResult = await this.assessmentResultRepo.find({ assessmentYear: { id: assessmentYear[0].id }, assessment: { id: assessmentYear[0].assessment.id } })
          assessmentResult[0].isResultupdated = false
          assessmentResult[0].qcStatuProjectResult = undefined
          assessmentResult[0].qcStatusBaselineResult = undefined
          assessmentResult[0].qcStatusLekageResult = undefined
          assessmentResult[0].qcStatusTotalEmission = undefined
          assessmentResult[0].qcStatusbsTotalAnnualCost = undefined
          assessmentResult[0].qcStatuscostDifference = undefined
          assessmentResult[0].qcStatusmacResult = undefined
          assessmentResult[0].qcStatuspsTotalAnnualCost = undefined
          let asr = await this.assessmentResultRepo.update(assessmentResult[0].id, assessmentResult[0])
        }

        if (res) {
          response.status = 'saved'
          return response
        } else {
          response.status = 'failed to save'
          return response
        }
      } else {
        //data collection path
        // 1. Duplicate parameter
        // 2. create new data request
        // 3. Set assessmentYear qaStatus ->   Pending = 1
        let newPara = new Parameter()
        newPara = {...parameter}
        newPara.id = undefined  
        newPara.institution = correctData.institution
        newPara.uomDataEntry = correctData.unit
        newPara.verifierAcceptance = VerifierAcceptance.RETURNED
        newPara.previouseParameterId = parameter.id
        newPara.value = undefined
        newPara.conversionValue = undefined

        let res = await this.parameterRepo.save([parameter, newPara])

        let request = new ParameterRequest()
        request.parameter = newPara
        request.dataRequestStatus = DataRequestStatus.initiate

        let assessmentYear = await this.assessmentYearRepo.find(
          {
            where: {assessment: {id: parameter.assessment.id}},
            relations: ['assessment']
          }
        )
        assessmentYear[0].qaStatus = undefined
        assessmentYear[0].isVerificationSuccess = false
        assessmentYear[0].verificationStatus = VerificationStatus.AssessmentReturned

        let asy = await this.assessmentYearRepo.update(assessmentYear[0].id, assessmentYear[0])

        let res2 = await this.ParameterRequestRepo.save(request)
       
        this.parameterHistoryService.SaveParameterHistory(
          res2.id,
          ParameterHistoryAction.EnterData,
          'Sector admin - Reassigned data provider',
          res2.noteDataRequest,
          res2.dataRequestStatus.toString(),
          oldDatarqst?.dataRequestStatus.toString(),
        );

        let assessmentResult = await this.assessmentResultRepo.find({ assessmentYear: { id: assessmentYear[0].id }, assessment: { id: assessmentYear[0].assessment.id } })
        assessmentResult[0].isResultupdated = false
        assessmentResult[0].qcStatuProjectResult = undefined
        assessmentResult[0].qcStatusBaselineResult = undefined
        assessmentResult[0].qcStatusLekageResult = undefined
        assessmentResult[0].qcStatusTotalEmission = undefined
        assessmentResult[0].qcStatusbsTotalAnnualCost = undefined
        assessmentResult[0].qcStatuscostDifference = undefined
        assessmentResult[0].qcStatusmacResult = undefined
        assessmentResult[0].qcStatuspsTotalAnnualCost = undefined
        let asr = await this.assessmentResultRepo.update(assessmentResult[0].id, assessmentResult[0])

        if (res && res2) {
          response.status = 'saved'
          return response
        } else {
          response.status = 'failed to save'
          return response
        }
      }
    } catch (error){
      return new InternalServerErrorException()
    }
  }

  async sendResultToRecalculate(assessmentYearId: number){
    let response = new ResposeDto()
    try{
      let assessmentYear = await this.assessmentYearRepo.find(
        {
          where: {id: assessmentYearId},
          relations: ['assessment']
        }
      )
      assessmentYear[0].qaStatus = QuAlityCheckStatus.Pending
      assessmentYear[0].isVerificationSuccess = false
      assessmentYear[0].verificationStatus = VerificationStatus.AssessmentReturned
  
      let res1 = await this.assessmentYearRepo.update(assessmentYear[0].id, assessmentYear[0])
  
      let assessmentResult = await this.assessmentResultRepo.find({ assessmentYear: { id: assessmentYear[0].id }, assessment: { id: assessmentYear[0].assessment.id } })
      
      assessmentResult[0].isResultRecalculating = true
      assessmentResult[0].qcStatuProjectResult = undefined
      assessmentResult[0].qcStatusBaselineResult = undefined
      assessmentResult[0].qcStatusLekageResult = undefined
      assessmentResult[0].qcStatusTotalEmission = undefined
      assessmentResult[0].qcStatusbsTotalAnnualCost = undefined
      assessmentResult[0].qcStatuscostDifference = undefined
      assessmentResult[0].qcStatusmacResult = undefined
      assessmentResult[0].qcStatuspsTotalAnnualCost = undefined
      let res2 = await this.assessmentResultRepo.update(assessmentResult[0].id, assessmentResult[0])
  
      if (res1 && res2) {
        response.status = 'saved'
        return response
      } else {
        response.status = 'failed to save'
        return response
      }
    } catch(error){
      return new InternalServerErrorException()
    }
    
  }
}
