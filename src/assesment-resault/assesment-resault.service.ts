import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { AxiosResponse } from 'axios';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
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
    const assement = new Assessment();
    assement.id = assesmentId;

    let assesmentYear = new AssessmentYear();
    assesmentYear.id = assesmentYearId;

    const assessmentResault = await this.repo.findOne({
      where: { assement: assement, assessmentYear: assesmentYear },
      relations: ['assessmentYear'],
    });

    assesmentYear = await this.assessmentYearRepo.findOne(assesmentYearId);

    if (isCalculate.toString() == 'false') {
      return assessmentResault;
    } else {
      const asseDetail = await this.assesmentRepo.findOne(assesmentId);

      if (asseDetail.isProposal) {
        var assesment = await this.assesmentservice.getAssessmentDetails(
          assesmentId,
          assesmentYear.assessmentYear,
        );
      } else {
        var assesment = await this.assesmentservice.getAssessmentDetailsForQC(
          assesmentId,
          assesmentYear.assessmentYear,
        );
      }

      if (!assesment.isProposal) {
        const result = assesment.parameters.find((m) =>
          m.parameterRequest
            ? m.parameterRequest.qaStatus !== QuAlityCheckStatus.Pass
            : false,
        );

        if (result === null || result === undefined) {
          await this.getAssesmentResultFromEngine(
            assesment.parameters,
          ).subscribe(async (a) => {
            const saveEntity = await this.saveAssesmentResult(
              a.data,
              assesmentId,
              assesmentYearId,
            );

            return saveEntity;
          });
        } else {
          return null;
        }
      } else {
        await this.getAssesmentResultFromEngine(assesment.parameters).subscribe(
          (a) => {
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
    const assesment = new Assessment();
    assesment.id = assesmentId;

    const assesmentYear = new AssessmentYear();
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
      const responce = await this.repo.save(assesmentResult);
      await this.saveProjectionResult(data, assesment, assesmentYear);

      return responce;
    } else {
      const responce = await this.repo.insert(assesmentResult);
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
          const responce = await this.projectionResaultRepo.insert(
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
    assesmentyearId: number,
    qcStatus: QuAlityCheckStatus,
    assessmentResultType: AssessmentResultType,
    comment: string,
  ) {
    const result = await this.repo.findOne(id);
    result.qcComment = comment;

    const re = await this.repo.findOne({
      where: { id: id },
      relations: ['assement'],
    });
    const country = re.assement.project.country;
    const sec = re.assement.project.sector;
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
            re.assement.project.climateActionName;
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
            re.assement.project.climateActionName +
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
      const assementYear = await this.assessmentYearRepo.findOne(
        assesmentyearId,
      );

      assementYear.qaStatus = qcStatus;
      this.assessmentYearRepo.save(assementYear);
    }

    return resultTo;
  }

  async updateQCStatusforMac(
    assesmentyearId: number,
    qcStatus: QuAlityCheckStatus,
  ) {
    const assementYear = await this.assessmentYearRepo.findOne(assesmentyearId);

    assementYear.qaStatus = qcStatus;
    this.assessmentYearRepo.save(assementYear);
    return 1;
  }

  async updateVRStatusforMac(
    assesmentyearId: number,
    VRStatus: VerificationStatus,
  ) {
    const assementYear = await this.assessmentYearRepo.findOne(assesmentyearId);

    assementYear.verificationStatus = VRStatus;
    this.assessmentYearRepo.save(assementYear);
    return 1;
  }

  getAssesmentResultFromEngine(
    parametrs: Parameter[],
  ): Observable<AxiosResponse<any>> {
    try {
      const baseurl = this.configService.get<string>('calculationEngineUrl');
      const fullUrl = 'http://13.233.122.62:3600/methodology/calculation';

      const content_ = JSON.stringify(parametrs);
      const options_ = <RequestInit>{
        body: content_,
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      };

      const bodyParser = require('body-parser');

      return this.httpService.post(
        fullUrl,
        { body: content_ },
        { headers: { 'api-key': '1234' } },
      );
    } catch (e) {}
  }

  async updateQCStatusBaslineResult(
    id: number,
    qcStatus: QuAlityCheckStatus,
    assessmentResultType: AssessmentResultType,
    assesmentyearId: number,
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

    const assementYear = await this.assessmentYearRepo.findOne(assesmentyearId);

    assementYear.qaStatus = qcStatus;
    this.assessmentYearRepo.save(assementYear);
  }

  async GetAllAssesmentResult(
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
        'dr.assement',
        Assessment,
        'ass',
        'ass.id = dr.assementId',
      )
      .leftJoinAndMapOne('ass.project', Project, 'pr', 'pr.id = ass.projectId')
      .where(filter, {
        AssessmentYearId,
      })
      .orderBy('dr.id', 'ASC');

    const resualt = await paginate(data, options);

    if (resualt) {
      return resualt;
    }
  }

  async getAssessmentResultBYAssessmentId(id: number): Promise<any> {
    const data = this.repo
      .createQueryBuilder('ar')
      .leftJoinAndMapOne(
        'ar.assessmentResult',
        Assessment,
        'asse',
        'asse.id = ar.assementId ',
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
        'asse.id = ar.assementId and asse.assessmentType="Ex-post"  ',
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
