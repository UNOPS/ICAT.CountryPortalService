import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Crud, CrudController } from '@nestjsx/crud';
import * as moment from 'moment';
import { audit } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
import { Repository } from 'typeorm';
import { AuditService } from './audit.service';
import { AuditDto } from './dto/audit-dto';
import { Audit } from './entity/audit.entity';

@Crud({
  model: {
    type: Audit,
  },
  query: {
    join: {
      country: {
        eager: true,
      },
      user: {
        eager: true,
      },
    },
  },
})
@Controller('audit')
export class AuditController implements CrudController<Audit> {
  constructor(
    public service: AuditService,
    @InjectRepository(Audit)
    private readonly projectRepository: Repository<Audit>,
    public configService: ConfigService,
    private readonly tokenDetails: TokenDetails,
  ) {}

  get base(): CrudController<Audit> {
    return this;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() auditDto: AuditDto) {
    return this.service.create(auditDto);
  }

  @Get('userCount')
  async getUserCount(@Query('countryId') countryId: number) {
    return this.service.userCount(countryId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('audit/auditinfo/:page/:limit/:userTypeId/:action/:editedOn/:filterText')
  async getAuditDetails(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('userTypeId') userTypeId: string,
    @Query('action') action: string,
    @Query('editedOn') editedOn: string,
    @Query('filterText') filterText: string,
  ): Promise<any> {
    const timestamp = Date.parse(editedOn);
    const dateObject = new Date(timestamp);

    let role: string;
    let username: string;
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;
    let institutionIdFromTocken: number;

    [
      role,
      username,
      countryIdFromTocken,
      sectorIdFromTocken,
      institutionIdFromTocken,
    ] = this.tokenDetails.getDetails([
      TokenReqestType.role,
      TokenReqestType.username,
      TokenReqestType.countryId,
      TokenReqestType.sectorId,
      TokenReqestType.InstitutionId,
    ]);

    return await this.service.getAuditDetails(
      {
        limit: limit,
        page: page,
      },
      filterText,
      userTypeId,
      action,
      editedOn,
      role,
      username,
      countryIdFromTocken,
      sectorIdFromTocken,
      institutionIdFromTocken,
    );
  }
}
