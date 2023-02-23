import {
  Body,
  Controller,
  Get,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiHeader } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { AuditService } from 'src/audit/audit.service';
import { AuditDto } from 'src/audit/dto/audit-dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
import { Repository } from 'typeorm-next';
import { Project } from './entity/project.entity';
import { ProjectService } from './project.service';
const fs = require('fs');

@Crud({
  model: {
    type: Project,
  },
  query: {
    join: {
      projectStatus: {
        eager: true,
      },
      sector: {
        eager: true,
      },
      subSector: {
        eager: true,
      },
      ndc: {
        eager: true,
      },
      subNdc: {
        eager: true,
      },
      projectOwner: {
        eager: true,
      },
      financingScheme: {
        eager: true,
      },
      assessments: {
        eager: true,
      },
      mappedInstitution: {
        eager: true,
      },
      country: {
        eager: true,
      },
      mitigationActionType: {
        eager: true,
      },
      projectApprovalStatus: {
        eager: true,
      },
    },
  },
})
@Controller('project')
export class ProjectController implements CrudController<Project> {
  constructor(
    public service: ProjectService,
    public mailService: EmailNotificationService,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    public configService: ConfigService,
    private readonly auditService: AuditService,
    private readonly tokenDetails: TokenDetails,
  ) {}

  get base(): CrudController<Project> {
    return this;
  }

  @Override()
  async createOne(
    @Request() request,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Project,
  ) {
    try {
      dto.createdBy = '-';
      dto.editedBy = '-';

      if (dto.assessments.length === 0) {
        dto.assessments = null;
      }

      if (dto.reportProject.length === 0) {
        dto.reportProject = null;
      }

      if (dto.mappedInstitution?.id === undefined) {
        dto.mappedInstitution = null;
      }

      dto.reportProject = null;

      const newplData = await this.base.createOneBase(req, dto);

      return newplData;
    } catch (error) {
      throw error;
    }
  }
  @UseGuards(JwtAuthGuard)
  @Get(
    'project/projectinfo/:page/:limit/:sectorId/:statusId/:mitigationActionTypeId/:editedOn/:filterText',
  )
  async getClimateActionDetails(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sectorId') sectorId: number,
    @Query('statusId') statusId: number,
    @Query('mitigationActionTypeId') mitigationActionTypeId: number,
    @Query('editedOn') editedOn: string,
    @Query('filterText') filterText: string,
  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;
    let institutionIdFromTocken: number;

    [countryIdFromTocken, sectorIdFromTocken, institutionIdFromTocken] =
      this.tokenDetails.getDetails([
        TokenReqestType.countryId,
        TokenReqestType.sectorId,
        TokenReqestType.InstitutionId,
      ]);

    return await this.service.getProjectDetails(
      {
        limit: limit,
        page: page,
      },
      filterText,
      sectorId,
      statusId,
      mitigationActionTypeId,
      editedOn,
      countryIdFromTocken,
      sectorIdFromTocken,
      institutionIdFromTocken,
    );
  }

  @Get(
    'AllClimateActions/projectinfo/:page/:limit/:filterText/:projectStatusId/:projectApprovalStatusId/:assessmentStatusName/:Active/:countryId/:sectorId',
  )
  async getAllClimateActionDetails(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('projectStatusId') projectStatusId: number,
    @Query('projectApprovalStatusId') projectApprovalStatusId: number,
    @Query('assessmentStatusName') assessmentStatusName: string,
    @Query('Active') Active: number,
    @Query('countryId') countryId: number,
    @Query('sectorId') sectorId: number,
  ): Promise<any> {
    return await this.service.getAllProjectDetails(
      {
        limit: limit,
        page: page,
      },
      filterText,
      projectStatusId,
      projectApprovalStatusId,
      assessmentStatusName,
      Active,
      countryId,
      sectorId,
    );
  }

  @Get(
    'AllProjectDetailsmanagedatastatus/projectinfo/:page/:limit/:filterText/:projectStatusId/:projectApprovalStatusId/:assessmentStatusName/:Active/:countryId/:sectorId',
  )
  async getAllProjectDetailsmanagedatastatus(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('projectStatusId') projectStatusId: number,
    @Query('projectApprovalStatusId') projectApprovalStatusId: number,
    @Query('assessmentStatusName') assessmentStatusName: string,
    @Query('Active') Active: number,
    @Query('countryId') countryId: number,
    @Query('sectorId') sectorId: number,
  ): Promise<any> {
    return await this.service.getAllProjectDetailsmanagedatastatus(
      {
        limit: limit,
        page: page,
      },
      filterText,
      projectStatusId,
      projectApprovalStatusId,
      assessmentStatusName,
      Active,
      countryId,
      sectorId,
    );
  }

  @Get('AllClimateActions/projectinfo/:page/:limit/:filterText')
  async getDateRequest(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
  ): Promise<any> {
    return await this.service.getDateRequest(
      {
        limit: limit,
        page: page,
      },
      filterText,
    );
  }
  @UseGuards(JwtAuthGuard)
  @UseGuards(LocalAuthGuard)
  @Get(
    'AllClimateActions/projectinfo/:page/:limit/:countryId/:sectorId/:ndcId/:subndcId',
  )
  @ApiHeader({
    name: 'api-key',
    description: 'A Custom Header',
    schema: { type: 'string', default: '1234' },
  })
  async getactiveClimateActionDetails(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,

    @Query('sectorId') sectorId: number,
    @Query('ndcId') ndcId: number,
    @Query('subndcId') subndcId: number,
    @Query('projectApprovalStatusId') projectApprovalStatusId: number,
  ): Promise<any> {
    let countryIdFromTocken: number;

    [countryIdFromTocken] = this.tokenDetails.getDetails([
      TokenReqestType.countryId,
    ]);

    return await this.service.getactiveClimateActionDetails(
      {
        limit: limit,
        page: page,
      },
      countryIdFromTocken,
      sectorId,
      ndcId,
      subndcId,
      projectApprovalStatusId,
    );
  }

  @UseGuards(LocalAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Get(
    'AllClimateAction/projectinfo/:page/:limit/:filterText/:projectStatusId/:projectApprovalStatusId/:assessmentStatusName/:countryId/:sectorId',
  )
  @ApiHeader({
    name: 'api-key',
    description: 'A Custom Header',
    schema: { type: 'string', default: '1234' },
  })
  async getAllClimateActionList(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('projectStatusId') projectStatusId: number,
    @Query('projectApprovalStatusId') projectApprovalStatusId: number,
    @Query('assessmentStatusName') assessmentStatusName: string,

    @Query('sectorId') sectorId: number,
  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;

    [countryIdFromTocken, sectorIdFromTocken] = this.tokenDetails.getDetails([
      TokenReqestType.countryId,
      TokenReqestType.sectorId,
    ]);

    return await this.service.getAllCAList(
      {
        limit: limit,
        page: page,
      },
      filterText,
      projectStatusId,
      projectApprovalStatusId,
      assessmentStatusName,

      sectorId,
      countryIdFromTocken,
      sectorIdFromTocken,
    );
  }

  @UseGuards(LocalAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Get(
    'ActiveClimateActions/projectinfo/:page/:limit/:filterText/:projectApprovalStatusId/:isProposal/:sectorId/:asseType',
  )
  @ApiHeader({
    name: 'api-key',
    description: 'A Custom Header',
    schema: { type: 'string', default: '1234' },
  })
  async getActiveClimateActionList(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('projectApprovalStatusId') projectApprovalStatusId: number,
    @Query('projectStatus') projectStatus: number,
    @Query('isProposal') isProposal: number,
    @Query('sectorId') sectorId: number,
    @Query('asseType') asseType: string,
  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;

    [countryIdFromTocken, sectorIdFromTocken] = this.tokenDetails.getDetails([
      TokenReqestType.countryId,
      TokenReqestType.sectorId,
    ]);

    return await this.service.getActCAList(
      {
        limit: limit,
        page: page,
      },
      filterText,
      projectStatus,
      projectApprovalStatusId,
      isProposal,

      sectorId,
      countryIdFromTocken,
      sectorIdFromTocken,
      asseType,
    );
  }

  @UseGuards(LocalAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Get(
    'AllClimateActions/getProjectList/:page/:limit/:filterText/:projectStatusId/:projectApprovalStatusId/:assessmentStatusName/:Active/:countryId/:sectorId',
  )
  @ApiHeader({
    name: 'api-key',
    description: 'A Custom Header',
    schema: { type: 'string', default: '1234' },
  })
  async getProjectList(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('projectStatusId') projectStatusId: number,
    @Query('projectApprovalStatusId') projectApprovalStatusId: number,
    @Query('assessmentStatusName') assessmentStatusName: string,
    @Query('Active') Active: number,

    @Query('sectorId') sectorId: number,
  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;

    [countryIdFromTocken, sectorIdFromTocken] = this.tokenDetails.getDetails([
      TokenReqestType.countryId,
      TokenReqestType.sectorId,
    ]);

    return await this.service.getProjectList(
      {
        limit: limit,
        page: page,
      },
      filterText,
      projectStatusId,
      projectApprovalStatusId,
      assessmentStatusName,
      Active,
      sectorId,
      countryIdFromTocken,
      sectorIdFromTocken,
    );
  }

  @Put('update-project-anonymous')
  async updateProjectAnonymous(@Body() dto: Project) {
    let newplData: any;

    const existingProject = await this.projectRepository.findOne({
      where: { id: dto.id, projectApprovalStatus: null },
    });
    if (existingProject) {
      newplData = await this.projectRepository.save(dto);
    }

    if (newplData) {
      this.service.mail(newplData);
      return true;
    }
    return false;
  }

  @UseGuards(JwtAuthGuard)
  @Override()
  async updateOne(
    @Request() request,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Project,
  ) {
    const project = await this.projectRepository.findOne({
      where: { id: dto.id },
      relations: ['projectApprovalStatus'],
    });

    const updateData = await this.base.updateOneBase(req, dto);
    const audit: AuditDto = new AuditDto();
    const baseurl = this.configService.get<string>('ClientURl');

    if (
      dto.projectApprovalStatus &&
      dto.projectApprovalStatus.id !== project.projectApprovalStatus?.id
    ) {
      if (dto.projectApprovalStatus.id === 1) {
        let emailTemplate = fs.readFileSync(
          './template/email/status-approved-ca.html',
          'utf8',
        );
        emailTemplate = emailTemplate.replace('[USER_NAME]', `User`);
        emailTemplate = emailTemplate.replace(
          '[CA_Name]',
          dto.climateActionName,
        );
        emailTemplate = emailTemplate.replace(
          '[CA_URL]',
          baseurl + 'propose-project?id=' + dto.id + '&flag=1',
        );

        this.mailService.sendMail(
          project.email,
          'Approval Status Approved',
          'Approval Status Approved',
          emailTemplate,
        );
        audit.action = dto.climateActionName + ' Approved';
        audit.comment = 'Project Approved';
        audit.actionStatus = 'Approved';
        this.auditService.create(audit);
      }
      if (dto.projectApprovalStatus.id === 2) {
        let emailTemplate = fs.readFileSync(
          './template/email/status-rejected-ca.html',
          'utf8',
        );
        emailTemplate = emailTemplate.replace('[USER_NAME]', `User`);
        emailTemplate = emailTemplate.replace(
          '[CA_Name]',
          dto.climateActionName,
        );
        emailTemplate = emailTemplate.replace(
          '[CA_URL]',
          baseurl + 'propose-project?id=' + dto.id + '&flag=1',
        );
        this.mailService.sendMail(
          project.email,
          'Approval Status Rejected',
          'Approval Status Rejected',
          emailTemplate,
        );
        audit.action = dto.climateActionName + ' Rejected';
        audit.comment = 'Project Rejected';
        audit.actionStatus = 'Rejected';
        this.auditService.create(audit);
      }
      if (dto.projectApprovalStatus.id === 3) {
        let emailTemplate = fs.readFileSync(
          './template/email/status-datarequest-ca.html',
          'utf8',
        );
        emailTemplate = emailTemplate.replace('[USER_NAME]', `User`);
        emailTemplate = emailTemplate.replace(
          '[CA_Comment]',
          dto.projectDataRequsetComment,
        );
        emailTemplate = emailTemplate.replace(
          '[CA_Name]',
          dto.climateActionName,
        );
        emailTemplate = emailTemplate.replace(
          '[CA_URL]',
          baseurl + 'propose-project?id=' + dto.id + '&flag=1',
        );
        this.mailService.sendMail(
          project.email,
          'Data request sent successfully',
          'Data request sent successfully',
          emailTemplate,
        );
        audit.action = dto.climateActionName + ' Data Requested';
        audit.comment = 'Project Data Requested';
        audit.actionStatus = 'Data Requested';
        this.auditService.create(audit);
      }
    }
    return updateData;
  }

  @Get('getProjectByIdAnonymous/byprojectId/:id')
  async getProjectByIdAnonymous(
    @Request() request,
    @Query('id') id: number,
  ): Promise<any> {
    return await this.projectRepository.findOne({
      where: { id: id, projectApprovalStatus: null },
    });
  }

  @Get('trackpage/byprojectId/:id')
  async getTProjectById(
    @Request() request,
    @Query('id') id: number,
  ): Promise<any> {
    return await this.service.getTProjectById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('dash')
  async getProjectsForCountryAndSectorAdmins(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sectorId') sectorId: number,
    @Query('projectApprovalStatus') projectApprovalStatus: number[],
    @Query('ndcId') ndcId: number,
    @Query('subNdcId') subNdcId: number,
  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;
    let institutionIdFromTocken: number;

    [countryIdFromTocken, sectorIdFromTocken, institutionIdFromTocken] =
      this.tokenDetails.getDetails([
        TokenReqestType.countryId,
        TokenReqestType.sectorId,
        TokenReqestType.InstitutionId,
      ]);

    const result = await this.service.getProjectsForCountryAndSectorAdmins(
      {
        limit: limit,
        page: page,
      },
      sectorId,
      projectApprovalStatus,
      ndcId,
      subNdcId,
      countryIdFromTocken,
      sectorIdFromTocken,
      institutionIdFromTocken,
    );

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('TrackClimateActions/trackinfo/:page/:limit/:year/:selectedNdcIds')
  async getTrackClimateActionsDetails(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('year') year: string,
    @Query('selectedNdcIds') selectedNdcIds: string,
  ): Promise<any> {
    let countryIdFromTocken: number;

    [countryIdFromTocken] = this.tokenDetails.getDetails([
      TokenReqestType.countryId,
    ]);

    return await this.service.getTrackClimateActionsDetails(
      {
        limit: limit,
        page: page,
      },
      filterText,
      year,
      selectedNdcIds,
      countryIdFromTocken,
    );
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(LocalAuthGuard)
  @Get('projectsForCountryAndSectorAdminsprojectApprovalStatusWise')
  @ApiHeader({
    name: 'api-key',
    description: 'A Custom Header',
    schema: { type: 'string', default: '1234' },
  })
  async getProjectsForCountryAndSectorAdminsprojectApprovalStatusWise(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sectorId') sectorId: number,
    @Query('projectApprovalStatus') projectApprovalStatus: number[],
    @Query('ndcId') ndcId: number,
    @Query('subNdcId') subNdcId: number,
  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;
    let institutionIdFromTocken: number;

    [countryIdFromTocken, sectorIdFromTocken, institutionIdFromTocken] =
      this.tokenDetails.getDetails([
        TokenReqestType.countryId,
        TokenReqestType.sectorId,
        TokenReqestType.InstitutionId,
      ]);

    const result =
      await this.service.getProjectsForCountryAndSectorAdminsprojectApprovalStatusWise(
        {
          limit: limit,
          page: page,
        },
        sectorId,
        projectApprovalStatus,
        ndcId,
        subNdcId,
        countryIdFromTocken,
        sectorIdFromTocken,
        institutionIdFromTocken,
      );

    return result;
  }
  @UseGuards(JwtAuthGuard)
  @Get('getProjectsForCountrySectorInstitution')
  async getProjectsForCountrySectorInstitution(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sectorId') sectorId: number,
    @Query('projectApprovalStatus') projectApprovalStatus: number[],
    @Query('ndcId') ndcId: number,
    @Query('subNdcId') subNdcId: number,
  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;
    let institutionIdFromTocken: number;

    [countryIdFromTocken, sectorIdFromTocken, institutionIdFromTocken] =
      this.tokenDetails.getDetails([
        TokenReqestType.countryId,
        TokenReqestType.sectorId,
        TokenReqestType.InstitutionId,
      ]);

    const result = await this.service.getProjectsForCountrySectorInstitution(
      {
        limit: limit,
        page: page,
      },
      sectorId,
      projectApprovalStatus,
      ndcId,
      subNdcId,
      countryIdFromTocken,
      sectorIdFromTocken,
      institutionIdFromTocken,
    );

    return result;
  }
}
