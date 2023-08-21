import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { AxiosResponse } from 'axios';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Observable } from 'rxjs';
import { AssessmentService } from 'src/assessment/assessment.service';
import { Assessment } from 'src/assessment/entity/assessment.entity';
import { AssessmentYear } from 'src/assessment-year/entity/assessment-year.entity';
import { Project } from 'src/project/entity/project.entity';
import { Parameter } from 'src/parameter/entity/parameter.entity';
import { ProjectionResult } from 'src/projection-result/entity/projection-result.entity';
import { QuAlityCheckStatus } from 'src/quality-check/entity/quality-check-status.entity';
import { Repository } from 'typeorm';
import { AssessmentResult } from './entity/assessment-result.entity';
import { AssessmentResultType } from './entity/assessment-result-type.entity';
import { VerificationStatus } from 'src/verification/entity/verification-status.entity';
import { Institution } from 'src/institution/institution.entity';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AssessmentResultService extends TypeOrmCrudService<AssessmentResult> {
  constructor(
    @InjectRepository(AssessmentResult) repo,
    private assessmentservice: AssessmentService,
    @InjectRepository(AssessmentYear)
    private readonly assessmentYearRepo: Repository<AssessmentYear>,
    @InjectRepository(Institution)
    public institutionRepo: Repository<Institution>,

    @InjectRepository(ProjectionResult)
    private readonly projectionResultRepo: Repository<ProjectionResult>,
    private httpService: HttpService,
    private configService: ConfigService,
    private readonly emaiService: EmailNotificationService,
    @InjectRepository(Assessment)
    public assessmentRepo: Repository<Assessment>,
    private readonly userService: UsersService,
  ) {
    super(repo);
  }

  async GetAssessmentResult(
    assessmentId: number,
    assessmentYearId: number,
    isCalculate: boolean,
    flag = ''
  ): Promise<any> {
    let assessment = new Assessment();
    assessment.id = assessmentId;

    let assessmentYear = new AssessmentYear();
    assessmentYear.id = assessmentYearId;

    let assessmentResult = await this.repo.findOne({
      where: { assessment: assessment, assessmentYear: assessmentYear },
      relations: ['assessmentYear'],
    });

    assessmentYear = await this.assessmentYearRepo.findOne(assessmentYearId);

    if (isCalculate.toString() == 'false') {
        return assessmentResult;
    } else {
      let asseDetail = await this.assessmentRepo.findOne(assessmentId);
     
      if(asseDetail.isProposal)
      {
        var assessmentProposal = await this.assessmentservice.getAssessmentDetails(
          assessmentId,
          assessmentYear.assessmentYear,
        );
      }
      else {
        var assessmentProposal = await this.assessmentservice.getAssessmentDetailsForQC(
          assessmentId,
          assessmentYear.assessmentYear,
        );
      }

      if (!assessmentProposal.isProposal) {
        let result = await assessmentProposal.parameters.find(
          (m) =>m.parameterRequest?m.parameterRequest.qaStatus !== QuAlityCheckStatus.Pass:false,
        );

        if (result === null || result === undefined) {
          await this.getAssessmentResultFromEngine(
            assessmentProposal.parameters,
          ).subscribe(async (a) => {
            let saveEntity = await this.saveAssessmentResult(
              a.data,
              assessmentId,
              assessmentYear,
            );
            return saveEntity;
          });
        } else {
          return null;
        }
      } else {
        await this.getAssessmentResultFromEngine(assessmentProposal.parameters).subscribe(
          (a) => {
            return this.saveAssessmentResult(
              a.data,
              assessmentId,
              assessmentYear,
            );
          },
        );
      }
    }
  }


  async saveAssessmentResult(
    data: any,
    assessmentId: number,
    assessmentYearObj: AssessmentYear,
  ) {
    let assessment = new Assessment();
    assessment.id = assessmentId;

    let assessmentYear = new AssessmentYear();
    assessmentYear.id = assessmentYearObj.id;

    let assessmentResult = await this.repo.findOne({
      where: { assessment: assessment, assessmentYear: assessmentYear },
    });

    if (assessmentResult === undefined || assessmentResult === null) {
      assessmentResult = new AssessmentResult();
      assessmentResult.assessment = assessment;
      assessmentResult.assessmentYear = assessmentYear;
    }

    assessmentResult.projectResult = data.projectEmission;
    assessmentResult.baselineResult = data.baseLineEmission;
    assessmentResult.lekageResult = data.leakegeEmission;
    assessmentResult.totalEmission = data.emissionReduction;


    assessmentResult.isResultupdated = true
    assessmentResult.isResultRecalculating = false

    if (assessmentResult.id > 0) {
      let responce = await this.repo.save(assessmentResult);
      await this.saveProjectionResult(data, assessment, assessmentYear);

      return responce;
    } else {
      let responce = await this.repo.insert(assessmentResult);
      await this.saveProjectionResult(data, assessment, assessmentYear);

      return responce;
    }
  }

  async saveProjectionResult(
    data: any,
    assessment: Assessment,
    assessmentYear: AssessmentYear,
  ) {
    if (data.projectionResults) {
      data.projectionResults.map(async (p) => {
        let projectionResult = await this.projectionResultRepo.findOne({
          where: { assessment: assessment, projectionYear: p.year },
        });

        if (projectionResult === undefined || projectionResult === null) {
          projectionResult = new ProjectionResult();
          projectionResult.assessment = assessment;
          projectionResult.projectionYear = p.year;
        }
        projectionResult.projectResult = p.projectEmission;
        projectionResult.baselineResult = p.baselineEmission;
        projectionResult.leakageResult = p.leakegeEmission;
        projectionResult.emissionReduction = p.emissionReduction;
        projectionResult.projectionResult = 0;

        if (projectionResult.id > 0) {
          await this.projectionResultRepo.save(projectionResult);
        } else {
          const response = await this.projectionResultRepo.insert(
            projectionResult,
          );
        }
      });
    }
  }
  async checkAllQCApprovmentAssessmentResult(
    assRsltId: number,
  ): Promise<boolean> {
    const result = await this.repo
      .createQueryBuilder('dr')

      .where(
        'dr.id=:assRsltId and (dr.qcStatusBaselineResult= 4 or dr.baselineResult is null ) and (dr.qcStatuProjectResult= 4 or dr.projectResult is null)and (dr.qcStatusLekageResult= 4 or dr.lekageResult is null) and (dr.qcStatusTotalEmission= 4 or dr.totalEmission is null)and (dr.qcStatusmacResult= 4 or dr.macResult is null) and (dr.qcStatuscostDifference= 4 or dr.costDifference is null)and (dr.qcStatuspsTotalAnnualCost= 4 or dr.psTotalAnnualCost is null)and (dr.qcStatusbsTotalAnnualCost= 4 or dr.bsTotalAnnualCost is null) ',
        {
          assRsltId,
        },
      )
      .getOne();

    if (result) {
      return true;
    }

    return false;
  }

  async updateQCStatus(
    id: number,
    assessmentyearId: number,
    qcStatus: QuAlityCheckStatus,
    assessmentResultType: AssessmentResultType,
    comment: string,
  ) {
    const result = await this.repo.findOne(id);
    result.qcComment = comment;

    const re = await this.repo.findOne({
      where: { id: id },
      relations: ['assessment'],
    });
    const country = re.assessment.project.country;
    const sec = re.assessment.project.sector;
    let template: any;
    let ins: any;
    let user: User[];
    if (qcStatus == QuAlityCheckStatus.Pass) {
      ins = await this.institutionRepo.findOne({
        where: { country: country, sector: sec, type: 2 },
      });
      user = await this.userService.find({
        where: { country: country, userType: 5, institution: ins },
      });

      user.forEach((ab) => {
        if (comment != undefined) {
          template =
            'Dear ' +
            ab.username +
            ' ' +
            ' <br/> Data request with following information has shared with you.' +
            '<br/> parameter name -: ' +
            re.assessment.project.climateActionName;
        } else {
          template =
            'Dear ' + ab.username + ' ' + ' <br/> Accepted reviw value ';
        }

        this.emaiService.sendMail(ab.email, 'Pass QC', '', template);
      });
    } else {
      ins = await this.institutionRepo.findOne({
        where: { country: country, sector: sec, type: 2 },
      });
      user = await this.userService.find({
        where: { country: country, userType: 6, institution: ins },
      });

      user.forEach((ab) => {
        if (comment != undefined) {
          template =
            'Dear ' +
            ab.username +
            ' ' +
            ' <br/> Reject QC' +
            '<br/> parameter name -: ' +
            re.assessment.project.climateActionName +
            '<br> comment -: ' +
            comment;
        } else {
          template = 'Dear ' + ab.username + ' ' + ' <br/> Reject QC ';
        }
        this.emaiService.sendMail(ab.email, 'Reject QC', '', template);
      });
    }

    if (assessmentResultType === AssessmentResultType.Baseline) {
      result.qcStatusBaselineResult = qcStatus;
    } else if (assessmentResultType === AssessmentResultType.Project) {
      result.qcStatuProjectResult = qcStatus;
    } else if (assessmentResultType === AssessmentResultType.Leakage) {
      result.qcStatusLekageResult = qcStatus;
    } else if (assessmentResultType === AssessmentResultType.TotalEmission) {
      result.qcStatusTotalEmission = qcStatus;
    } else if (assessmentResultType === AssessmentResultType.macResult) {
      result.qcStatusmacResult = qcStatus;
    } else if (assessmentResultType === AssessmentResultType.costDifference) {
      result.qcStatuscostDifference = qcStatus;
    } else if (
      assessmentResultType === AssessmentResultType.psTotalAnnualCost
    ) {
      result.qcStatuspsTotalAnnualCost = qcStatus;
    } else if (
      assessmentResultType === AssessmentResultType.bsTotalAnnualCost
    ) {
      result.qcStatusbsTotalAnnualCost = qcStatus;
    }
    const resultTo = this.repo.save(result);

    if (
      qcStatus == QuAlityCheckStatus.Fail ||
      (await this.checkAllQCApprovmentAssessmentResult(result.id))
    ) {
      const assessmentYear = await this.assessmentYearRepo.findOne(
        assessmentyearId,
      );

      assessmentYear.qaStatus = qcStatus;
      this.assessmentYearRepo.save(assessmentYear);
    }

    return resultTo;
  }

  async updateQCStatusforMac(
    assessmentyearId: number,
    qcStatus: QuAlityCheckStatus,
  ) {
    const assessmentYear = await this.assessmentYearRepo.findOne(
      assessmentyearId,
    );

    assessmentYear.qaStatus = qcStatus;
    this.assessmentYearRepo.save(assessmentYear);
    return 1;
  }

  async updateVRStatusforMac(
    assessmentyearId: number,
    VRStatus: VerificationStatus,
  ) {
    const assessmentYear = await this.assessmentYearRepo.findOne(
      assessmentyearId,
    );

    assessmentYear.verificationStatus = VRStatus;
    this.assessmentYearRepo.save(assessmentYear);
    return 1;
  }

  getAssessmentResultFromEngine(
    parametrs: Parameter[],
  ): Observable<AxiosResponse<any>> {
    try {
      const fullUrl = `${process.env.CAL_ENGINE_BASE_URL}/methodology/calculation`;
      const content_ = JSON.stringify(parametrs);
      const options_ = <RequestInit>{
        body: content_,
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      };

      return this.httpService.post(
        fullUrl,
        { body: content_ },
        { headers: { 'api-key': process.env.API_KEY_1 } },
      );
    } catch (e) {}
  }

  async updateQCStatusBaslineResult(
    id: number,
    qcStatus: QuAlityCheckStatus,
    assessmentResultType: AssessmentResultType,
    assessmentyearId: number,
  ) {
    const result = await this.repo.findOne(id);

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

    const assessmentYear = await this.assessmentYearRepo.findOne(
      assessmentyearId,
    );

    assessmentYear.qaStatus = qcStatus;
    this.assessmentYearRepo.save(assessmentYear);
  }

  async GetAllAssessmentResult(
    options: IPaginationOptions,
    AssessmentYearId: number,
  ): Promise<any> {
    let filter = '';

    if (AssessmentYearId != 0) {
      if (filter) {
        filter = `${filter}  and dr.assessmentYearId = :AssessmentYearId`;
      } else {
        filter = `dr.assessmentYearId = :AssessmentYearId`;
      }
    }
    const data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapOne(
        'dr.assessment',
        Assessment,
        'ass',
        'ass.id = dr.assessmentId',
      )
      .leftJoinAndMapOne('ass.project', Project, 'pr', 'pr.id = ass.projectId')
      .where(filter, {
        AssessmentYearId,
      })
      .orderBy('dr.id', 'ASC');

    const result = await paginate(data, options);

    if (result) {
      return result;
    }
  }

  async getAssessmentResultBYAssessmentId(id: number): Promise<any> {
    const data = this.repo
      .createQueryBuilder('ar')
      .leftJoinAndMapOne(
        'ar.assessmentResult',
        Assessment,
        'asse',
        'asse.id = ar.assessmentId ',
      )
      .where('asse.id = ' + id);

    const result = await data.getMany();

    return result;
  }
  async getAssessmentResultforDashboard(
    assessmentYear: number,
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
    moduleLevelsFromTocken: number[],
  ): Promise<any> {
    let filter = '';

    if (moduleLevelsFromTocken[3] == 1 || moduleLevelsFromTocken[4] == 1) {
      if (filter) {
        filter = `${filter}  and  asse.isProposal= false and proj.projectApprovalStatusId = 5`;
      } else {
        filter = `asse.isProposal= false and proj.projectApprovalStatusId = 5`;
      }
    } else if (
      moduleLevelsFromTocken[1] == 1 ||
      moduleLevelsFromTocken[2] == 1
    ) {
      if (filter) {
        filter = `${filter}  and  asse.isProposal= true  and proj.projectApprovalStatusId in (1,4)`;
      } else {
        filter = `asse.isProposal= true and proj.projectApprovalStatusId in (1,4)`;
      }
    } else {
      if (filter) {
        filter = `${filter}  and  asse.isProposal= false and proj.projectApprovalStatusId = 5 `;
      } else {
        filter = `asse.isProposal= false and proj.projectApprovalStatusId = 5`;
      }
    }

    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and proj.countryId = :countryIdFromTocken`;
      } else {
        filter = `proj.countryId = :countryIdFromTocken`;
      }
    }

    if (sectorIdFromTocken) {
      if (filter) {
        filter = `${filter}  and proj.sectorId = :sectorIdFromTocken  `;
      } else {
        filter = `proj.sectorId = :sectorIdFromTocken`;
      }
    }

    const data = this.repo
      .createQueryBuilder('ar')
      .innerJoinAndMapOne(
        'ar.assessmentYear',
        AssessmentYear,
        'assesyear',
        `assesyear.id = ar.assessmentYearId and assesyear.assessmentYear = ${assessmentYear} `,
      )
      .innerJoinAndMapOne(
        'ar.assessment',
        Assessment,
        'asse',
        'asse.id = ar.assessmentId and asse.assessmentType="Ex-post"  ',
      )
      .innerJoinAndMapOne(
        'asse.project',
        Project,
        'proj',
        'proj.id=asse.projectId ',
      )
      .where(filter, {
        countryIdFromTocken,
        sectorIdFromTocken,
      });

    const result = await data.getMany();

    return result;
  }
}
