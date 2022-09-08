import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { AxiosResponse } from 'axios';
//import e from 'express';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import e, { json } from 'express';
import { Observable } from 'rxjs';
import { AssesmentService } from 'src/assesment/assesment.service';
import { Assessment } from 'src/assesment/entity/assesment.entity';
import { AssessmentYear } from 'src/assessment-year/entity/assessment-year.entity';
import { Project } from 'src/project/entity/project.entity';
import { Parameter } from 'src/parameter/entity/parameter.entity';
import { ProjectionResault } from 'src/projection-resault/entity/projection-resault.entity';
import { QuAlityCheckStatus } from 'src/quality-check/entity/quality-check-status.entity';
import { Repository } from 'typeorm';
import { AssessmentResault } from './entity/assessment-resault.entity';
import { AssessmentResultType } from './entity/assessment-result-type.entity';
import { VerificationStatus } from 'src/verification/entity/verification-status.entity';
import { url } from 'inspector';
import { Institution } from 'src/institution/institution.entity';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AssesmentResaultService extends TypeOrmCrudService<AssessmentResault> {
  constructor(
    @InjectRepository(AssessmentResault) repo,
    private assesmentservice: AssesmentService,
    @InjectRepository(AssessmentYear)
    private readonly assessmentYearRepo: Repository<AssessmentYear>,
    @InjectRepository(Institution)
    public institutionRepo: Repository<Institution>,
    
    // @InjectRepository(User)
    // public userRepo: Repository<User>,
    @InjectRepository(ProjectionResault)
    private readonly projectionResaultRepo: Repository<ProjectionResault>,
    private httpService: HttpService,
    private configService: ConfigService,
    private readonly emaiService: EmailNotificationService,
    @InjectRepository(Assessment)
    public assesmentRepo: Repository<Assessment>,
    private readonly userService: UsersService,
  ) {
    super(repo);
  }

  async GetAssesmentResult(
    assesmentId: number,
    assesmentYearId: number,
    isCalculate: boolean,
  ): Promise<any> {
    console.log("qastatus..1");
    let assement = new Assessment();
    assement.id = assesmentId;

    let assesmentYear = new AssessmentYear();
    assesmentYear.id = assesmentYearId;
    console.log("AID-----",assesmentYear.id )

    let assessmentResault = await this.repo.findOne({
      where: { assement: assement, assessmentYear: assesmentYear },
      relations: ['assessmentYear'],
    });

    assesmentYear = await this.assessmentYearRepo.findOne(assesmentYearId);

    if (isCalculate.toString() == 'false') {
      return assessmentResault;
    } else {

      let asseDetail = await this.assesmentRepo.findOne(assesmentId);
     

      if(asseDetail.isProposal)
      {
        console.log("asse details..id ",asseDetail.id)
        var assesment = await this.assesmentservice.getAssessmentDetails(
          assesmentId,
          assesmentYear.assessmentYear,
        );
      }
      else
      {
        var assesment = await this.assesmentservice.getAssessmentDetailsForQC(
          assesmentId,
          assesmentYear.assessmentYear,
        );
      }

     

      if (!assesment.isProposal) {
        console.log("qastatus..2");
        let result = assesment.parameters.find(
          (m) =>m.parameterRequest?m.parameterRequest.qaStatus !== QuAlityCheckStatus.Pass:false,
        );

        if (result === null || result === undefined) {
          await this.getAssesmentResultFromEngine(
            assesment.parameters,
          ).subscribe(async (a) => {
            console.log('Calcuclation Responce 123', a.data);
            let saveEntity = await this.saveAssesmentResult(
              a.data,
              assesmentId,
              assesmentYearId,
            );
            console.log('ddddddddddddddddd');
            console.log(saveEntity);
            return saveEntity;
          });
        } else {
          //cannot call calculation engine parameters  not ready
          console.log('cannot call calculation engine parameters  not ready');
          return null;
        }
      } else {
        console.log("lemgth of para..",assesment.parameters.length)
        await this.getAssesmentResultFromEngine(assesment.parameters).subscribe(
          (a) => {
            console.log('Calcuclation Responce....', a.data);
            return this.saveAssesmentResult(
              a.data,
              assesmentId,
              assesmentYearId,
            );
          },
        );
      }
    }
  }

  async saveAssesmentResult(
    data: any,
    assesmentId: number,
    assesmentYearId: number,
  ) {
    let assesment = new Assessment();
    assesment.id = assesmentId;

    let assesmentYear = new AssessmentYear();
    assesmentYear.id = assesmentYearId;

    let assesmentResult = await this.repo.findOne({
      where: { assement: assesment, assessmentYear: assesmentYear },
    });

    if (assesmentResult === undefined || assesmentResult === null) {
      assesmentResult = new AssessmentResault();
      assesmentResult.assement = assesment;
      assesmentResult.assessmentYear = assesmentYear;
    }

    assesmentResult.projectResult = data.projectEmission;
    assesmentResult.baselineResult = data.baseLineEmission;
    assesmentResult.lekageResult = data.leakegeEmission;
    assesmentResult.totalEmission = data.emissionReduction;

    if (assesmentResult.id > 0) {
      let responce = await this.repo.save(assesmentResult);
      await this.saveProjectionResult(data, assesment, assesmentYear);

      return responce;
    } else {
      let responce = await this.repo.insert(assesmentResult);
      await this.saveProjectionResult(data, assesment, assesmentYear);

      return responce;
    }
  }

  async saveProjectionResult(
    data: any,
    assesment: Assessment,
    assesmentYear: AssessmentYear,
  ) {
    if (data.projectionResults) {
      data.projectionResults.map(async (p) => {
        let projectionResult = await this.projectionResaultRepo.findOne({
          where: { assement: assesment, projectionYear: p.year },
        });

        if (projectionResult === undefined || projectionResult === null) {
          projectionResult = new ProjectionResault();
          projectionResult.assement = assesment;
          projectionResult.projectionYear = p.year;
        }
        projectionResult.projectResult = p.projectEmission;
        projectionResult.baselineResult = p.baselineEmission;
        projectionResult.leakageResult = p.leakegeEmission;
        projectionResult.emissionReduction = p.emissionReduction;
        projectionResult.projectionResualt = 0;

        if (projectionResult.id > 0) {
          await this.projectionResaultRepo.save(projectionResult);
        } else {
          let responce = await this.projectionResaultRepo.insert(
            projectionResult,
          );
        }
      });
    }
  }
  async checkAllQCApprovmentAssessmentResult(assRsltId:number):Promise<boolean>{
    // this.repo.findOne({  where: {
    //   id: assRsltId,
    //   qcStatusBaselineResult:4,
    //   qcStatuProjectResult:4,
    //   qcStatusLekageResult:4,
    //   qcStatusTotalEmission:4,
    //   qcStatusmacResult:4,
    //   qcStatuscostDifference:4,
    //   qcStatuspsTotalAnnualCost:4,
    //   qcStatusbsTotalAnnualCost:4,
     
    // }});

    let result =await this.repo
    .createQueryBuilder('dr')
  
    .where('dr.id=:assRsltId and (dr.qcStatusBaselineResult= 4 or dr.baselineResult is null ) and (dr.qcStatuProjectResult= 4 or dr.projectResult is null)and (dr.qcStatusLekageResult= 4 or dr.lekageResult is null) and (dr.qcStatusTotalEmission= 4 or dr.totalEmission is null)and (dr.qcStatusmacResult= 4 or dr.macResult is null) and (dr.qcStatuscostDifference= 4 or dr.costDifference is null)and (dr.qcStatuspsTotalAnnualCost= 4 or dr.psTotalAnnualCost is null)and (dr.qcStatusbsTotalAnnualCost= 4 or dr.bsTotalAnnualCost is null) ', {
      assRsltId
    }).getOne();
    console.log('checkAllQCApprovmentAssessmentResult', assRsltId)
    console.log('checkAllQCApprovmentAssessmentResult', result)
    if(result){

      return true
    }

return false;
  }

  async updateQCStatus(
    id: number,
    assesmentyearId: number,
    qcStatus: QuAlityCheckStatus,
    assessmentResultType: AssessmentResultType,
    comment: string,
  ) {
    console.log("qastatus..3");
    var result = await this.repo.findOne(id);
    result.qcComment = comment;

    let re = await this.repo.findOne({where:{id:id},relations:['assement']})
    let country = re.assement.project.country;
    let sec = re.assement.project.sector;
    let template: any;
    let ins :any;
    let user:User[];
    if(qcStatus==QuAlityCheckStatus.Pass){
       ins = await this.institutionRepo.findOne({ where: { country: country, sector: sec, type: 2 } });
       user= await this.userService.find({where:{country:country,userType:5,institution:ins}})
      console.log("=========", ins)
      user.forEach((ab)=>{
        if (comment != undefined) {
          template =
            'Dear ' +
            ab.username + ' ' +
            ' <br/> Data request with following information has shared with you.' +
            '<br/> parameter name -: ' + re.assement.project.climateActionName ;
        }
        else {
          template =
            'Dear ' + ab.username + ' ' +
            ' <br/> Accepted reviw value '
          // '<br/> parameter name -: ' + dataRequestItem.parameter.name +
          // '<br/> value -:' + dataRequestItem.parameter.value;
        }
  
        this.emaiService.sendMail(
          ab.email,
          'Pass QC',
          '',
          template,
        );
      })
      
    }

    else{
      ins = await this.institutionRepo.findOne({ where: { country: country, sector: sec, type: 2} });
      user= await this.userService.find({where:{country:country,userType:6,institution:ins}})
      // console.log("=========", ins)
      user.forEach((ab)=>{
        
      if (comment != undefined) {
        template =
          'Dear ' +
          ab.username  + ' ' +
          ' <br/> Reject QC' +
          '<br/> parameter name -: ' + re.assement.project.climateActionName +
          // '<br/> value -:' + dataRequestItem.parameter.value +
          '<br> comment -: ' + comment;
      }
      else {
        template =
          'Dear ' + ab.username  + ' ' +
          ' <br/> Reject QC '
        // '<br/> parameter name -: ' + dataRequestItem.parameter.name +
        // '<br/> value -:' + dataRequestItem.parameter.value;

      }
      this.emaiService.sendMail(
        ab.email,
        'Reject QC',
        '',
        template,
      );
      })
    
    }

    


   

    if (assessmentResultType === AssessmentResultType.Baseline) {
      result.qcStatusBaselineResult = qcStatus;
    } else if (assessmentResultType === AssessmentResultType.Project) {
      result.qcStatuProjectResult = qcStatus;
    } else if (assessmentResultType === AssessmentResultType.Leakage) {
      result.qcStatusLekageResult = qcStatus;
    } else if (assessmentResultType === AssessmentResultType.TotalEmission) {
      result.qcStatusTotalEmission = qcStatus;
    }
    else if (assessmentResultType === AssessmentResultType.macResult) {
      result.qcStatusmacResult = qcStatus;
    }
    else if (assessmentResultType === AssessmentResultType.costDifference) {
      result.qcStatuscostDifference = qcStatus;
    }
    else if (assessmentResultType === AssessmentResultType.psTotalAnnualCost) {
      result.qcStatuspsTotalAnnualCost = qcStatus;
    }
    else if (assessmentResultType === AssessmentResultType.bsTotalAnnualCost) {
      result.qcStatusbsTotalAnnualCost = qcStatus;
    }
     let resultTo = this.repo.save(result);
     
     if(qcStatus==QuAlityCheckStatus.Fail  || await this.checkAllQCApprovmentAssessmentResult(result.id)){

      var assementYear = await this.assessmentYearRepo.findOne(assesmentyearId);
    
      assementYear.qaStatus = qcStatus;
      this.assessmentYearRepo.save(assementYear);

     }
    
     return resultTo;
  }


  async updateQCStatusforMac(
    
    assesmentyearId: number,
    qcStatus: QuAlityCheckStatus,
    
  ) {
    console.log("qastatus..4");
    var assementYear = await this.assessmentYearRepo.findOne(assesmentyearId);

    assementYear.qaStatus = qcStatus;
    this.assessmentYearRepo.save(assementYear);
    return 1;
  }


  async updateVRStatusforMac(
    
    assesmentyearId: number,
    VRStatus: VerificationStatus,
    
  ) {
    
    var assementYear = await this.assessmentYearRepo.findOne(assesmentyearId);

    assementYear.verificationStatus = VRStatus;
    this.assessmentYearRepo.save(assementYear);
    return 1;
  }

  getAssesmentResultFromEngine(
    parametrs: Parameter[],
  ): Observable<AxiosResponse<any>> {
    try {
      console.log("tttttteeee");

      let baseurl = this.configService.get<string>('calculationEngineUrl');
        let fullUrl = 'http://65.2.75.253:3600/methodology/calculation';
      // let fullUrl =  'http://localhost:3600/methodology/calculation';

      const content_ = JSON.stringify(parametrs);
      //console.log("json obj,...",content_);
      let options_ = <RequestInit>{
        body: content_,
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        
      }
      // options_.headers = headersRequest;

      var bodyParser = require('body-parser');
     console.log("ppppppppppppppppppppppppppppppppppppppppppppppp")
      
      return this.httpService.post(fullUrl, {body:content_},{headers:{'api-key':'1234'}});
      //return this.httpService.post(fullUrl,{headers:{'api-key':'1234'}});


    } catch (e) {
      console.log('calculation Engine error', e);
    }
  }

  async updateQCStatusBaslineResult(
    id: number,
    qcStatus: QuAlityCheckStatus,
    assessmentResultType: AssessmentResultType,
    assesmentyearId: number,
  ) {
    var result = await this.repo.findOne(id);

    if (assessmentResultType === AssessmentResultType.Baseline) {
      result.qcStatusBaselineResult = qcStatus;
    } else if (assessmentResultType === AssessmentResultType.Project) {
      result.qcStatuProjectResult = qcStatus;
    } else if (assessmentResultType === AssessmentResultType.Leakage) {
      result.qcStatusLekageResult = qcStatus;
    } else if (assessmentResultType === AssessmentResultType.TotalEmission) {
      result.qcStatusTotalEmission = qcStatus;
    }
    this.repo.save(result);

    var assementYear = await this.assessmentYearRepo.findOne(assesmentyearId);

    assementYear.qaStatus = qcStatus;
    this.assessmentYearRepo.save(assementYear);
  }

  async GetAllAssesmentResult(
    options: IPaginationOptions,
    AssessmentYearId: number,
  ): Promise<any> {
    let filter: string = '';

    if (AssessmentYearId != 0) {
      if (filter) {
        filter = `${filter}  and dr.assessmentYearId = :AssessmentYearId`;
      } else {
        filter = `dr.assessmentYearId = :AssessmentYearId`;
      }
    }
    let data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapOne(
        'dr.assement',
        Assessment,
        'ass',
        'ass.id = dr.assementId',
      )
      .leftJoinAndMapOne('ass.project', Project, 'pr', 'pr.id = ass.projectId')

      //   .innerJoinAndMapOne('dr.user', User, 'u', 'dr.userId = u.id')

      .where(filter, {
        AssessmentYearId,
      })
      .orderBy('dr.id', 'ASC');
    console.log(
      '=====================================================================',
    );

    console.log(data.getQuery());

    let resualt = await paginate(data, options);

    if (resualt) {
      return resualt;
    }
  }


  async getAssessmentResultBYAssessmentId(
    
    id: number,
  ): Promise<any> {
    

    let data = this.repo
      .createQueryBuilder('ar')
      .leftJoinAndMapOne(
        'ar.assessmentResult',
        Assessment,
        'asse',
        'asse.id = ar.assementId ',
      )
      .where('asse.id = ' + id);

    // console.log(data.getQueryAndParameters());

    let result = await data.getMany();

    return result;
  }


}
