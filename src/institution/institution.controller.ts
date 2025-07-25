import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { Institution } from './institution.entity';
import { InstitutionService } from './institution.service';
import { getConnection } from 'typeorm';
import { AuditDto } from 'src/audit/dto/audit-dto';
import { AuditService } from 'src/audit/audit.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';

@Crud({
  model: {
    type: Institution,
  },
  query: {
    join: {
      category: {
        eager: true,
      },
      province: {
        eager: true,
      },
      district: {
        eager: true,
      },
      divisionalSecretariat: {
        eager: true,
      },
      parentInstitution: {
        eager: true,
      },
      type: {
        eager: true,
      },
      hierarchy: {
        eager: true,
      },
      sector: {
        eager: true,
      },
      country: {
        eager: true,
      },
    },
  },
})
@Controller('institution')
export class InstitutionController implements CrudController<Institution> {
  constructor(
    public service: InstitutionService,
    private readonly auditService: AuditService,
    private readonly tokenDetails: TokenDetails,
  ) {}

  get base(): CrudController<Institution> {
    return this;
  }

  @UseGuards(JwtAuthGuard)
  @Get(
    'getInstitutionDataProvider/institutioninfo/:page/:limit/:filterText/:userId',
  )
  async getInstitutionDataProvider(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('userId') userId: number,
  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;
    let userTypeFromTocken: string;
    let institutionTypeId: number;

    [countryIdFromTocken, sectorIdFromTocken, userTypeFromTocken] =
      this.tokenDetails.getDetails([
        TokenReqestType.countryId,
        TokenReqestType.sectorId,
        TokenReqestType.role,
      ]);

    return await this.service.getInstitutionDetails(
      {
        limit: limit,
        page: page,
      },
      filterText,
      userId,
      countryIdFromTocken,
      sectorIdFromTocken,
      institutionTypeId,
      'Technical Team',
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('institution/institutioninfo/:page/:limit/:filterText/:userId')
  async getInstiDetails(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('userId') userId: number,
  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;
    let userTypeFromTocken: string;
    let institutionTypeId: number;

    [countryIdFromTocken, sectorIdFromTocken, userTypeFromTocken] =
      this.tokenDetails.getDetails([
        TokenReqestType.countryId,
        TokenReqestType.sectorId,
        TokenReqestType.role,
      ]);

    return await this.service.getInstitutionDetails(
      {
        limit: limit,
        page: page,
      },
      filterText,
      userId,
      countryIdFromTocken,
      sectorIdFromTocken,
      institutionTypeId,
      userTypeFromTocken,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('institution/institutioninfo/:filterText/:userId')
  async getInsti(
    @Request() request,
    @Query('filterText') filterText: string,
    @Query('userId') userId: number,
  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;
    let userTypeFromTocken: string;
    let institutionTypeId: number;

    [countryIdFromTocken, sectorIdFromTocken, userTypeFromTocken] =
      this.tokenDetails.getDetails([
        TokenReqestType.countryId,
        TokenReqestType.sectorId,
        TokenReqestType.role,
      ]);

    return await this.service.getInsDetails(
      filterText,
      countryIdFromTocken,
      sectorIdFromTocken,
      userTypeFromTocken,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('deactivateInstitution')
  async deactivateInstitution(@Query('institutionId') institutionId: number): Promise<any> {
    const audit: AuditDto = new AuditDto();
    audit.action = 'Institution Deactivated';
    audit.comment = 'Institution Deactivated';
    audit.actionStatus = 'Deactivated';
    this.auditService.create(audit);
    return await this.service.softDelete(institutionId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getInstitutionforAssessment')
  async getInstitutionforAssessment(): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;

    [countryIdFromTocken, sectorIdFromTocken] = this.tokenDetails.getDetails([
      TokenReqestType.countryId,
      TokenReqestType.sectorId,
    ]);

    return await this.service.getInstitutionforAssessment(countryIdFromTocken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getInstitutionforApproveData')
  async getInstitutionforApproveData(): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;

    [countryIdFromTocken, sectorIdFromTocken] = this.tokenDetails.getDetails([
      TokenReqestType.countryId,
      TokenReqestType.sectorId,
    ]);

    return await this.service.getInstitutionforApproveData(
      countryIdFromTocken,
      sectorIdFromTocken,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Override()
  async createOne(
    @Request() request,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Institution,
  ): Promise<Institution> {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();
    try {
      dto.createdBy = '-';
      dto.editedBy = '-';

      dto.parentInstitution = null;

      if (dto.type != undefined) {
      }

      if (dto.category != undefined) {
      }

      if (dto.sector != undefined) {
      }

      const newInstitution = await queryRunner.manager.save(Institution, dto);

      const audit: AuditDto = new AuditDto();
      audit.action = newInstitution.name + ' Created';
      audit.comment = newInstitution.name + ' Created';
      audit.actionStatus = 'Created';

      this.auditService.create(audit);

      await queryRunner.commitTransaction();
      return newInstitution;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return err;
    } finally {
      await queryRunner.release();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Override()
  async updateOne(
    @Request() request,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Institution,
  ): Promise<Institution> {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    try {
      dto.editedOn = new Date();
      const updateInstitution = await queryRunner.manager.save(
        Institution,
        dto,
      );

      if (updateInstitution.status == 0) {
        const audit: AuditDto = new AuditDto();
        audit.action = updateInstitution.name + ' Institution Updated';
        audit.comment = 'Institution Updated';
        audit.actionStatus = 'Updated';
        this.auditService.create(audit);
      }
      await queryRunner.commitTransaction();
      return updateInstitution;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return err;
    } finally {
      await queryRunner.release();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('getInstitutionForManageUsers')
  async getInstitutionForManageUsers(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;
    let InstitutionIdFromTocken: number;
    let role: string;

    [countryIdFromTocken, sectorIdFromTocken, InstitutionIdFromTocken, role] =
      this.tokenDetails.getDetails([
        TokenReqestType.countryId,
        TokenReqestType.sectorId,
        TokenReqestType.InstitutionId,
        TokenReqestType.role,
      ]);

    const result = await this.service.getInstitutionForManageUsers(
      {
        limit: limit,
        page: page,
      },
      countryIdFromTocken,
      sectorIdFromTocken,
      InstitutionIdFromTocken,
      role,
    );

    return result;
  }

  @Get('getInstitutionForUsers')
  async getInstitutionForUsers(
    @Request() request,
    @Query('insId') insId: number,
    @Query('userType') userType: number,
  ): Promise<any> {
    const result = await this.service.getInstitutionForUsers(insId, userType);

    return result;
  }
}
