import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
import { Institution } from 'src/institution/institution.entity';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { ParameterHistoryAction } from 'src/parameter-history/entity/paeameter-history-action-history.entity';
import { ParameterHistoryService } from 'src/parameter-history/parameter-history.service';
import { Parameter } from 'src/parameter/entity/parameter.entity';
import { Project } from 'src/project/entity/project.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { VerificationDetail } from './entity/verification-detail.entity';

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
    private assesmentservice: AssesmentService,
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
  ): Promise<Pagination<AssessmentYear>> {
    let filter = `ae.verificationStatus is not null`;

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

      .where(filter, {
        filterText: `%${filterText}%`,
        VRstatusId,
      })

      .orderBy('ae.qaDeadline', 'DESC');

    const resualt = await paginate(data, options);

    if (resualt) {
      return resualt;
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
        filter +
          ' AND (ae.verificationStatus !=7 AND ae.verificationStatus !=6 AND ae.verificationUser =' +
          user.id +
          ' )',
        {
          filterText: `%${filterText}%`,
          VRstatusId,
        },
      );
    const resualt = await paginate(data, options);

    if (resualt) {
      return resualt;
    }
  }

  async SaveVerificationDetail(verificationDetail: VerificationDetail[]) {
    try {
      this.verificationDetailRepo.save(verificationDetail);

      const ass = verificationDetail[0].assessmentYear.id;

      const asseYa = await this.assessmentYearRepo.findOne({
        where: { id: ass },
      });
      const assesment = await this.assesmentservice.findOne({
        where: { id: verificationDetail[0].assessmentId },
      });

      let user: User[];
      const inscon = assesment.project.country;
      const insSec = assesment.project.sector;
      const ins = await this.institutionRepo.findOne({
        where: { country: inscon, sector: insSec, type: 2 },
      });
      user = await this.userRepo.find({
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

          const data = this.ParameterRequestRepo.createQueryBuilder(
            'paraReq',
          ).innerJoinAndMapOne(
            'paraReq.parameter',
            Parameter,
            'para',
            `paraReq.ParameterId = para.id and para.id = ${a.parameter.id}`,
          );

          const result1 = await data.getOne();

          if (a.id == undefined && a.isDataRequested == true) {
            const dataRequest = await this.ParameterRequestRepo.findOne({
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

    const resualt = data.getMany();

    if (resualt) {
      return resualt;
    }
  }
}
