import { InstitutionType } from 'src/institution/institution.type.entity';
import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  Post,
  UseGuards,
  Inject,
} from '@nestjs/common';
import {
  Crud,
  CrudController,
  CrudRequest,
  GetManyDefaultResponse,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { Institution } from './institution.entity';
import { InstitutionService } from './institution.service';
// import { Request, Post, UseGuards } from '@nestjs/common';
import { basename } from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { getConnection } from 'typeorm';
import { request } from 'http';
import { AuditDto } from 'src/audit/dto/audit-dto';
import { AuditService } from 'src/audit/audit.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { REQUEST } from '@nestjs/core';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
import { Audit } from 'src/audit/entity/audit.entity';

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
    private readonly tokenDetails: TokenDetails, // @Inject(REQUEST) private request
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
    // @Query('status') status: string
  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;
    let userTypeFromTocken: string;
    let institutionTypeId: number; //instypeId

    [countryIdFromTocken, sectorIdFromTocken, userTypeFromTocken] =
      this.tokenDetails.getDetails([
        TokenReqestType.countryId,
        TokenReqestType.sectorId,
        TokenReqestType.role,
      ]);

    console.log('userTypeFromTocken==', userTypeFromTocken);

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
      // status
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
    // @Query('status') status: string
  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;
    let userTypeFromTocken: string;
    let institutionTypeId: number; //instypeId

    [countryIdFromTocken, sectorIdFromTocken, userTypeFromTocken] =
      this.tokenDetails.getDetails([
        TokenReqestType.countryId,
        TokenReqestType.sectorId,
        TokenReqestType.role,
      ]);

    console.log('userTypeFromTocken==', userTypeFromTocken);

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
      // status
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('institution/institutioninfo/:filterText/:userId')
  async getInsti(
    @Request() request,
    @Query('filterText') filterText: string,
    @Query('userId') userId: number,
    // @Query('status') status: string
  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;
    let userTypeFromTocken: string;
    let institutionTypeId: number; //instypeId

    [countryIdFromTocken, sectorIdFromTocken, userTypeFromTocken] =
      this.tokenDetails.getDetails([
        TokenReqestType.countryId,
        TokenReqestType.sectorId,
        TokenReqestType.role,
      ]);

    console.log('userTypeFromTocken==', userTypeFromTocken);

    return await this.service.getInsDetails(
      filterText,
      countryIdFromTocken,
      sectorIdFromTocken,
      userTypeFromTocken,
      // status
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('deactivateInstituion')
  async deactivateInstitution(@Query('instiId') instiId: number): Promise<any> {
    const audit: AuditDto = new AuditDto();
    audit.action = 'Institution Deactivated';
    audit.comment = 'Institution Deactivated';
    audit.actionStatus = 'Deactivated';
    this.auditService.create(audit);
    console.log('Institution Deactivated');
    return await this.service.softDelete(instiId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getInstitutionforAssesment')
  async getInstitutionforAssesment(): Promise<any> {
    console.log('wwwwwwwwwwwwwwwwwwww');
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;

    [countryIdFromTocken, sectorIdFromTocken] = this.tokenDetails.getDetails([
      TokenReqestType.countryId,
      TokenReqestType.sectorId,
    ]);

    return await this.service.getInstitutionforAssesment(countryIdFromTocken);
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
  // @Override()
  // //@UseInterceptors(InstitutionFilterInterceptor, CrudRequestInterceptor)
  // async getMany(@ParsedRequest() req: CrudRequest, @Request() req2 ) :  Promise<GetManyDefaultResponse<Institution> | Institution[]>  {

  //   let userEmail =  req2.user.email;

  //   let currentDBUser = await this.usersRepository.findOne({where : {email : userEmail }});

  //   if(currentDBUser.userType.id != 1){
  //     // not ccs admin , linit data for the users' institution
  //     req.parsed.search['$and'].push({ 'id': (currentDBUser).institution.id });
  //   }

  //   return this.base.getManyBase(req);
  // }

  // @Override()
  // async deleteOne(@ParsedRequest() req: CrudRequest) {
  //   const id = req.parsed.paramsFilter
  //     .find(f => f.field === 'id' && f.operator === '$eq').value;
  //   const res = await this.service.softDelete(id);
  //   return res;
  // }

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
      console.log(
        '-----------------------------------------------------------',
      );
      dto.createdBy = '-';
      dto.editedBy = '-';

      dto.parentInstitution = null;
      // dto.country = null;
      if (dto.type != undefined) {
        console.log('type have', dto.type);
      }
      // dto.type =null;
      if (dto.category != undefined) {
        console.log('cat have', dto.category);
      }
      // dto.category =null;
      if (dto.sector != undefined) {
        console.log('sec have', dto.sector);
      }
      // else{
      // dto.sector = null;
      // }
      // dto.sector = null;

      console.log(dto);
      const newInstitution = await queryRunner.manager.save(Institution, dto);
      // let newInstitution = await this.base.createOneBase(req, dto);

      const audit: AuditDto = new AuditDto();
      audit.action = newInstitution.name + ' Created';
      audit.comment = newInstitution.name + ' Created';
      audit.actionStatus = 'Created';
      // await queryRunner.manager.save(AuditDto ,audit);
      this.auditService.create(audit);
      console.log('Institution created');

      await queryRunner.commitTransaction();
      return newInstitution;
    } catch (err) {
      console.log('worktran2');
      console.log(err);
      await queryRunner.rollbackTransaction();
      return err;
    } finally {
      await queryRunner.release();
    }
    // try {

    // } catch (error) {
    //   console.log('ssssssssssssaaaaaaaaaaaaaaaaaaa');
    //   console.log('error');
    //   throw error;
    // }
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
      // let updateInstitution = await this.base.updateOneBase(req, dto);
      if (updateInstitution.status == 0) {
        const audit: AuditDto = new AuditDto();
        audit.action = updateInstitution.name + ' Institution Updated';
        audit.comment = 'Institution Updated';
        audit.actionStatus = 'Updated';
        this.auditService.create(audit);
        console.log('Institution Updated');
      }
      await queryRunner.commitTransaction();
      return updateInstitution;
    } catch (err) {
      console.log('worktran2');
      console.log(err);
      await queryRunner.rollbackTransaction();
      return err;
    } finally {
      await queryRunner.release();
    }
  }
  // @Override()
  // async getMany(
  //   @ParsedRequest() req: CrudRequest,
  // ): Promise<GetManyDefaultResponse<Institution> | Institution[]> {
  //   try {
  //     let res = await this.base.getManyBase(req);
  //     console.log('*********************************************');
  //     console.log(res);
  //     console.log('*********************************************');
  //     console.log(req);
  //     return res;
  //   } catch (error) {
  //     console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  //     console.log(error);
  //   }
  // }

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

    console.log('countryIdFromTocken====', countryIdFromTocken);
    console.log('sectorIdFromTocken====', sectorIdFromTocken);

    console.log('InstitutionIdFromTocken====', InstitutionIdFromTocken);

    const resault = await this.service.getInstitutionForManageUsers(
      {
        limit: limit,
        page: page,
      },
      countryIdFromTocken,
      sectorIdFromTocken,
      InstitutionIdFromTocken,
      role,
    );

    return resault;
  }

  @Get('getInstitutionForUsers')
  async getInstitutionForUsers(
    @Request() request,
    @Query('insId') insId: number,
    @Query('userType') userType: number,
  ): Promise<any> {
    const resault = await this.service.getInstitutionForUsers(insId, userType);

    return resault;
  }
}
