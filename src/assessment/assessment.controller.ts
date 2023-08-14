import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { AssessmentObjective } from 'src/assessment-objective/entity/assessment-objective.entity';
import { AssessmentYear } from 'src/assessment-year/entity/assessment-year.entity';
import { AuditService } from 'src/audit/audit.service';
import { AuditDto } from 'src/audit/dto/audit-dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DataRequestStatus } from 'src/data-request/entity/data-request-status.entity';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { Institution } from 'src/institution/institution.entity';
import { ApplicabilityEntity } from 'src/master-data/applicability/entity/applicability.entity';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { Parameter } from 'src/parameter/entity/parameter.entity';
import { Project } from 'src/project/entity/project.entity';
import { ProjectionYear } from 'src/projection-year/entity/projection-year.entity';
import { User } from 'src/users/user.entity';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
import { getConnection, Repository } from 'typeorm-next';
import { AssessmentService } from './assessment.service';
import { Assessment } from './entity/assessment.entity';

@Crud({
  model: {
    type: Assessment,
  },
  query: {
    join: {
      methodology: {
        eager: true,
      },
      user: {
        eager: true,
      },
      project: {
        eager: true,
      },
      ndc: {
        eager: true,
      },
      subNdc: {
        eager: true,
      },
      assessmentObjective: {
        eager: true,
      },
      assessmentYear: {
        eager: true,
      },
      parameters: {
        eager: true,
      },
      assessmentResult: {
        eager: true,
      },
      verification: {
        eager: true,
      },
    },
  },
})
@Controller('assessment')
export class AssessmentController implements CrudController<Assessment> {
  constructor(
    public service: AssessmentService,
    @InjectRepository(Assessment)
    public assessmentRepo: Repository<Assessment>,
    @InjectRepository(Parameter)
    public paramterRepo: Repository<Parameter>,
    @InjectRepository(AssessmentYear)
    public assessmentYearsRepo: Repository<AssessmentYear>,
    @InjectRepository(ProjectionYear)
    public projectionYearsRepo: Repository<ProjectionYear>,
    @InjectRepository(Project)
    public projectRepo: Repository<Project>,
    @InjectRepository(AssessmentObjective)
    public assessmentObjectiveRepo: Repository<AssessmentObjective>,
    @InjectRepository(ApplicabilityEntity)
    public applicabilityEntityRepo: Repository<ApplicabilityEntity>,
    @InjectRepository(ParameterRequest)
    public parameterRequestRepo: Repository<ParameterRequest>,
    @InjectRepository(Institution)
    public institutionRepo: Repository<Institution>,
    @InjectRepository(User)
    public userRepo: Repository<User>,
    private readonly auditService: AuditService,
    private readonly tokenDetails: TokenDetails,
    private readonly emaiService: EmailNotificationService,
  ) {}

  get base(): CrudController<Assessment> {
    return this;
  }

  @UseGuards(JwtAuthGuard)
  @Get(
    'assessments/assessmentsinfo/:page/:limit/:filterText/:assessmentType/:isProposal/:projectId/:ctAction',
  )
  async getAssmentDetails(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('assessmentType') assessmentType: string,
    @Query('isProposal') isProposal: number,
    @Query('projectId') projectId: number,
    @Query('ctAction') ctAction: string,
  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;

    [countryIdFromTocken, sectorIdFromTocken] = this.tokenDetails.getDetails([
      TokenReqestType.countryId,
      TokenReqestType.sectorId,
      TokenReqestType.InstitutionId,
    ]);

    return await this.service.getassessmentsdetails(
      {
        limit: limit,
        page: page,
      },
      filterText,
      assessmentType,
      isProposal,
      projectId,
      ctAction,
      countryIdFromTocken,
      sectorIdFromTocken,
    );
  }

  @Get('assessments/getAssment/:id/:assessmentYear')
  async getAssment(
    @Request() request,
    @Query('id') id: number,
    @Query('assessmentYear') assessmentYear: string,
  ): Promise<any> {
    return await this.service.getAssessmentDetailsForQC(id, assessmentYear);
  }

  @Get('assessments/getassessmentData/:assessmentYear')
  async getassessmentData(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('assessmentYear') assessmentYear: string[],
  ): Promise<any> {
    return await this.service.getAssessmentData(
      {
        limit: limit,
        page: page,
      },
      assessmentYear,
    );
  }

  @Get('getAssessmentsForApproveData/:id/:assessmentYear/:userName')
  async getAssessmentsForApproveData(
    @Request() request,
    @Query('id') id: number,
    @Query('assessmentYear') assessmentYear: string,
    @Query('userName') userName: string,
  ): Promise<any> {
    return await this.service.getAssessmentForApproveData(
      id,
      assessmentYear,
      userName,
    );
  }

  @Get('checkAssessmentReadyForQC/getAssment/:id')
  async checkAssessmentReadyForQC(
    @Request() request,
    @Query('assessmentId') assessmentId: number,
    @Query('assessmentYear') assessmenYear: number,
  ): Promise<any> {
    return await this.service.checkAssessmentReadyForQC(
      assessmentId,
      assessmenYear,
    );
  }

  @Get('assessment/getAssessmentDetails')
  async getAssessmentDetails(
    @Request() request,
    @Query('assessmentId') assessmentId: number,
    @Query('assessmentYear') assessmenYear: string,
  ): Promise<any> {
    return await this.service.getAssessmentDetails(assessmentId, assessmenYear);
  }

  @Get('checkAssessmentReadyForCalculate/getAssment/:id')
  async checkAssessmentReadyForCalculate(
    @Request() request,
    @Query('assessmentId') assessmentId: number,
    @Query('assessmentYear') assessmenYear: number,
  ): Promise<any> {
    return await this.service.checkAssessmentReadyForCalculate(
      assessmentId,
      assessmenYear,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(
    'assessments/assmentdetailsforresult/:page/:limit/:filterText/:assessmentType/:isProposal/:projectId/:ctAction',
  )
  async getAssessmentDetailsForResult(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('assessmentType') assessmentType: string,
    @Query('isProposal') isProposal: number,
    @Query('projectId') projectId: number,
    @Query('ctAction') ctAction: string,
  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;

    [countryIdFromTocken, sectorIdFromTocken] = this.tokenDetails.getDetails([TokenReqestType.countryId, TokenReqestType.sectorId, TokenReqestType.InstitutionId])

    return await this.service.getassessmentsdetailsForResult(
      {
        limit: limit,
        page: page,
      },
      filterText,
      assessmentType,
      isProposal,
      projectId,
      ctAction,
      countryIdFromTocken,
      sectorIdFromTocken,
    );
  }

  @Get('methologyCount')
  async methodologyCount(@Query('countryId') countryId: number): Promise<any> {
    return this.service.methodologyUseCount(countryId);
  }

  @Get('assessmentForManageDataStatus')
  async assessmentForManageDataStatus(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('projectStatusId') projectStatusId: number,
    @Query('projectApprovalStatusId') projectApprovalStatusId: number,

    @Query('countryId') countryId: number,
    @Query('sectorId') sectorId: number,
    @Query('isProposal') isProposal: number,
  ): Promise<any> {
    return await this.service.assessmentForManageDataStatus(
      {
        limit: limit,
        page: page,
      },
      filterText,
      projectStatusId,
      projectApprovalStatusId,

      countryId,
      sectorId,
      isProposal,
    );
  }

  @Get('get-assessments-by-country-methodology')
  async getAssessmentsByCountryMethodology(
    @Query('methodId') methodId: number,
    @Query('countryId') countryId: number,
  ) {
    return this.service.getAssessmentsByCountryMethodology(methodId, countryId);
  }

  @Get('assessmentForMAC')
  async assessmentForMAC(
    @Request() request,
    @Query('projectId') projectId: number,
  ): Promise<any> {
    return await this.service.assessmentForMAC(projectId);
  }

  @UseGuards(JwtAuthGuard)
  @Override()
  async createOne(
    @Request() request,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Assessment,
  ): Promise<Assessment> {
    dto.createdBy = '-';
    dto.createdOn = new Date();
    dto.editedBy = '-';
    dto.editedOn = new Date();
    // const queryRunner = getConnection().createQueryRunner();
    // await queryRunner.startTransaction();
   
    try {
      if (dto.assessmentType != 'MAC') {
        if (dto.user.username === undefined) {
          dto.user = null;
        }

        if (dto.mitigationActionType.id === undefined) {
          dto.mitigationActionType = null;
        }

        const proj = new Project();
        proj.id = dto.project.id;
        dto.project = proj;

        // const assessment = await queryRunner.manager.save(Assessment, dto);
        const assessment = await this.assessmentRepo.save(dto);
        const audit: AuditDto = new AuditDto();
        audit.action = dto.assessmentType + ' Assessment Created';
        audit.comment = dto.assessmentType + ' Assessment Created';
        audit.actionStatus = 'Created';

        this.auditService.create(audit);

        dto.assessmentYear.map((a) => {
          const assessmenttemp = new Assessment();
          assessmenttemp.id = assessment.id;
          a.assessment = assessmenttemp;
        });

        dto.parameters.map((a) => {
          a.assessment = assessment;
        });

        dto.projectionYear &&
          dto.projectionYear.map((a) => {
            a.assessment = assessment;
          });

        dto.applicability &&
          dto.applicability.map((a) => {
            a.assessment = assessment;
          });

        dto.applicability !== undefined &&
          dto.applicability.map(async (a) => {
            // await queryRunner.manager.save(ApplicabilityEntity, a);
            await this.applicabilityEntityRepo.save(a);
          });

        dto.assessmentYear.map(async (a) => {
          // await queryRunner.manager.save(AssessmentYear, a);
          await this.assessmentYearsRepo.save(a);
        });

        // await queryRunner.manager.save(ProjectionYear, dto.projectionYear);
        this.projectionYearsRepo.save(dto.projectionYear)

        const grouped = dto.parameters
          .filter((i) => i.isAlternative)
          .reduce((r, v) => {
            const found = r.find(
              (element) =>
                JSON.stringify(element['parent']) ===
                JSON.stringify(v['ParentParameter']),
            );
            if (found == undefined) {
              r.push({
                parent: v['ParentParameter'],
                child: [v],
              });
            } else {
              found['child'].push(v);
              r[r.indexOf(found)] = found;
            }
            return r;
          }, []);

        const par2 = await dto.parameters.filter((i) => {
          const v = grouped.findIndex(
            (element) =>
              element['parent'].name == i.name &&
              element['parent'].originalName == i.originalName &&
              element['parent'].isAlternative == i.isAlternative &&
              element['parent'].isBaseline == i.isBaseline &&
              element['parent'].isProject == i.isProject &&
              element['parent'].isLekage == i.isLekage &&
              element['parent'].isProjection == i.isProjection &&
              element['parent'].vehical == i.vehical &&
              element['parent'].fuelType == i.fuelType &&
              element['parent'].route == i.route &&
              element['parent'].residue == i.residue &&
              element['parent'].soil == i.soil &&
              element['parent'].stratum == i.stratum &&
              element['parent'].feedstock == i.feedstock &&
              element['parent'].landClearance == i.landClearance &&
              element['parent'].powerPlant == i.powerPlant &&
              element['parent'].AssessmentYear == i.AssessmentYear,
          );
          return !i.isAlternative && v == -1;
        });

        dto.parameters = [];

        for await (const a of par2) {
          if (assessment.isProposal) {
            a.institution = null;
          }

          if (a.value) {
            a.institution = null;
          }

          a.parameterRequest = null;
          a.verificationDetail = null;
          a.isAlternative = false;

          // const param = await queryRunner.manager.save(Parameter, a);
          const param = await this.paramterRepo.save( a);

          await dto.parameters.push(param);

          if (a.value === null || a.value === undefined) {
            const paramReq = new ParameterRequest();
            paramReq.dataRequestStatus = DataRequestStatus.initiate;
            paramReq.parameter = param;

            // await queryRunner.manager.save(ParameterRequest, paramReq);
            await this.parameterRequestRepo.save( paramReq);
          }
        }

        for await (const a of grouped) {
          const parent = a['parent'];

          if (assessment.isProposal) {
            parent.institution = null;
          }

          parent.parameterRequest = null;
          parent.verificationDetail = null;
          parent.isAlternative = false;
          parent.assessment = assessment;
          parent.hasChild = true;

          // const paramParent = await queryRunner.manager.save(Parameter, parent);
          const paramParent = await this.paramterRepo.save(parent);

          dto.parameters.push(paramParent);

          if (parent.value === null || parent.value === undefined) {
            const paramReq = new ParameterRequest();
            paramReq.dataRequestStatus = DataRequestStatus.initiate;
            paramReq.parameter = paramParent;

            // await queryRunner.manager.save(ParameterRequest, paramReq);
            await this.parameterRequestRepo.save(paramReq);
          }

          for await (const b of a['child']) {
            if (assessment.isProposal) {
              b.institution = null;
            }

            b.parameterRequest = null;
            b.verificationDetail = null;
            b.ParentParameter.id = paramParent.id;
            b.ParentParameterId = paramParent.id;
            b.hasChild = true;
            const param = await this.paramterRepo.save(b);
            // const param = await queryRunner.manager.save(Parameter, b);
            dto.parameters.push(param);
            if (b.value === null || b.value === undefined) {
              const paramReq = new ParameterRequest();
              paramReq.dataRequestStatus = DataRequestStatus.initiate;
              paramReq.parameter = param;

              // await queryRunner.manager.save(ParameterRequest, paramReq);
              await this.parameterRequestRepo.save(paramReq);
            }
          }
        }

        if (dto.assessmentObjective) {
          for await (const a of dto.assessmentObjective) {
            if (a.id === 0) {
              a.assessmentId = assessment.id;
              a.status = 0;

              // await queryRunner.manager.save(AssessmentObjective, a);
            await this.assessmentObjectiveRepo.save(a)
            } else {
              a.id = null;
              a.assessmentId = assessment.id;

              // await queryRunner.manager.save(AssessmentObjective, a);
              await this.assessmentObjectiveRepo.save(a)
            }
          }
        }

        if (!dto.isProposal) {
          if (dto.ndc && dto.ndc.id !== dto.project.ndc?.id) {
            dto.project.ndc = dto.ndc;
          }
          if (dto.subNdc && dto.subNdc.id !== dto.project.subNdc?.id) {
            dto.project.subNdc = dto.subNdc;
          }
          if (dto.projectDuration !== dto.project.duration) {
            dto.project.duration = dto.projectDuration;
          }
          if (dto.projectStartDate !== dto.project.proposeDateofCommence) {
            dto.project.proposeDateofCommence = dto.projectStartDate;
          }

          // await queryRunner.manager.save(Project, dto.project);
          await this.projectRepo.save(dto.project)
        }

        // await queryRunner.commitTransaction();

        const pro = assessment.project.id;
        const pr = await this.projectRepo.findOne({
          where: { id: pro },
          relations: ['country'],
        });
        const con = pr.country;
        const sec = pr.sector;
        const ins = await this.institutionRepo.findOne({
          where: { country: con, sector: sec, type: 2 },
        });
        const user: User[] = await this.userRepo.find({
          where: { country: con, userType: 6, institution: ins },
        });

        user.forEach((ab) => {
          const template =
            'Dear ' +
            ab.username +
            ' ' +
            ' <br/> New Data request ' +
            '<br/> Data request with following information has shared with you.' +
            '<br/> project name -: ' +
            assessment.project.climateActionName;

          this.emaiService.sendMail(ab.email, 'New Data request', '', template);
        });

        return await this.assessmentRepo.findOne(assessment.id);
      } else {
        dto.ndc = null;
        dto.subNdc = null;
        dto.user = null;
        dto.applicability = null;
        dto.methodology = null;
        dto.mitigationActionType = null;

        const proj = new Project();
        proj.id = dto.project.id;
        dto.project = proj;
        const assessment = await this.assessmentRepo.save(dto);
        // const assessment = await queryRunner.manager.save(Assessment, dto);

        const audit: AuditDto = new AuditDto();
        audit.action = dto.assessmentType + ' Assessment Created';
        audit.comment = dto.assessmentType + ' Assessment Created';
        audit.actionStatus = 'Created';

        this.auditService.create(audit);

        dto.assessmentYear.map((a) => {
          a.assessment = assessment;
        });

        dto.assessmentObjective.map((a) => {
          a.assessmentId = assessment.id;
        });

        dto.parameters.map((a) => {
          a.assessment = assessment;
        });

        // await queryRunner.manager.save(AssessmentYear, dto.assessmentYear);
        this.assessmentYearsRepo.save( dto.assessmentYear)

        const grouped = dto.parameters
          .filter((i) => i.isAlternative)
          .reduce((r, v) => {
            const found = r.find(
              (element) =>
                JSON.stringify(element['parent']) ===
                JSON.stringify(v['ParentParameter']),
            );

            if (found == undefined) {
              r.push({ parent: v['ParentParameter'], child: [v] });
            } else {
              found['child'].push(v);
              r[r.indexOf(found)] = found;
            }
            return r;
          }, []);

        const par2 = dto.parameters.filter((i) => {
          const v = grouped.findIndex(
            (element) =>
              element['parent'].name == i.name &&
              element['parent'].originalName == i.originalName &&
              element['parent'].isAlternative == i.isAlternative &&
              element['parent'].isBaseline == i.isBaseline &&
              element['parent'].isProject == i.isProject &&
              element['parent'].isLekage == i.isLekage &&
              element['parent'].isProjection == i.isProjection &&
              element['parent'].vehical == i.vehical &&
              element['parent'].fuelType == i.fuelType &&
              element['parent'].route == i.route &&
              element['parent'].residue == i.residue &&
              element['parent'].soil == i.soil &&
              element['parent'].stratum == i.stratum &&
              element['parent'].feedstock == i.feedstock &&
              element['parent'].landClearance == i.landClearance &&
              element['parent'].powerPlant == i.powerPlant &&
              element['parent'].AssessmentYear == i.AssessmentYear,
          );
          return !i.isAlternative && v == -1;
        });

        dto.parameters = [];

        for await (const a of par2) {
          if (assessment.isProposal) {
            a.institution = null;
          }

          a.parameterRequest = null;
          a.verificationDetail = null;
          a.isAlternative = false;

          // const param = await queryRunner.manager.save(Parameter, a);
          const param = await this.paramterRepo.save(a);
          dto.parameters.push(param);

          if (a.value === null || a.value === undefined) {
            const paramReq = new ParameterRequest();
            paramReq.dataRequestStatus = DataRequestStatus.initiate;
            paramReq.parameter = param;

            // await queryRunner.manager.save(ParameterRequest, paramReq);
            this.parameterRequestRepo.save(paramReq)
          }
        }

        for await (const a of grouped) {
          const parent = a['parent'];

          if (assessment.isProposal) {
            parent.institution = null;
          }

          parent.parameterRequest = null;
          parent.verificationDetail = null;
          parent.isAlternative = false;
          parent.hasChild = true;
          parent.assessment = assessment;

          // const paramParent = await queryRunner.manager.save(Parameter, parent);
          const paramParent = await this.paramterRepo.save(parent);
          dto.parameters.push(paramParent);

          if (parent.value === null || parent.value === undefined) {
            const paramReq = new ParameterRequest();
            paramReq.dataRequestStatus = DataRequestStatus.initiate;
            paramReq.parameter = paramParent;

            // await queryRunner.manager.save(ParameterRequest, paramReq);
            await this.parameterRequestRepo.save(paramReq)
          }

          for await (const b of a['child']) {
            if (assessment.isProposal) {
              b.institution = null;
            }

            b.parameterRequest = null;
            b.verificationDetail = null;

            b.ParentParameter.id = paramParent.id;
            b.ParentParameterId = paramParent.id;

            // const param = await queryRunner.manager.save(Parameter, b);
            const param = await this.paramterRepo.save(b);
            dto.parameters.push(param);

            if (b.value === null || b.value === undefined) {
              const paramReq = new ParameterRequest();
              paramReq.dataRequestStatus = DataRequestStatus.initiate;
              paramReq.parameter = param;

              // await queryRunner.manager.save(ParameterRequest, paramReq);
              await this.parameterRequestRepo.save(paramReq)
            }
          }
        }

        // await queryRunner.commitTransaction();

        const pro = assessment.project.id;
        const pr = await this.projectRepo.findOne({
          where: { id: pro },
          relations: ['country'],
        });
        const con = pr.country;
        const sec = pr.sector;
        const ins = await this.institutionRepo.findOne({
          where: { country: con, sector: sec, type: 2 },
        });
        const user: User[] = await this.userRepo.find({
          where: { country: con, userType: 6, institution: ins },
        });
        user.forEach((ab) => {
          const template =
            'Dear ' +
            ab.username +
            ' ' +
            ' <br/> Data request with following information has shared with you.' +
            '<br/> project name -: ' +
            assessment.project.climateActionName;
          this.emaiService.sendMail(ab.email, 'Pass QC', '', template);
        });

        return await this.assessmentRepo.findOne(assessment.id);
      }
    } catch (err) {
      // await queryRunner.rollbackTransaction();
      throw new Error('error in saving assessment data');
    } finally {
      // await queryRunner.release();
    }
  }

  @Get('assessments/byprojectId/:id')
  async getAssessmentsBYProjectId(
    @Request() request,
    @Query('id') id: number,
  ): Promise<any> {
    return await this.service.getAssessmentsBYProjectId(id);
  }

  @Get('methodologyName/byassessmntId/:id')
  async getMethodologyNameByAssessmentId(
    @Request() request,
    @Query('id') id: number,
  ): Promise<any> {
    return await this.service.getMethodologyNameByAssessmentId(id);
  }

  @Get('testTransaction')
  async testTransaction(@Request() request): Promise<any> {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const asses = new Assessment();
      asses.baseYear = 0;

      const assessment = await queryRunner.manager.save(Assessment, asses);
      const para = new Parameter();

      para.assessment = assessment;

      await queryRunner.commitTransaction();

      return await this.service.testTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new Error('error in saving assessment data');
    } finally {
      await queryRunner.release();
    }
  }
}
