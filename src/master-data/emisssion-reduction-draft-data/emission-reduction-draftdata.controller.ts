import {
  Controller,
  Get,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
import { Repository } from 'typeorm';
import { EmissionReductionDraftdataService } from './emission-reduction-draftdata.service';
import { EmissionReductioDraftDataEntity } from './entity/emission-reductio-draft-data.entity';

@Crud({
  model: {
    type: EmissionReductioDraftDataEntity,
  },
  query: {
    join: {
      country: {
        eager: true,
      },
      sector: {
        eager: true,
      },
    },
  },
})
@Controller('emission-reduction-draftdata')
export class EmissionReductionDraftdataController
  implements CrudController<EmissionReductioDraftDataEntity>
{
  constructor(
    public service: EmissionReductionDraftdataService,
    public tokenDetails: TokenDetails,
  ) {}

  get base(): CrudController<EmissionReductioDraftDataEntity> {
    return this;
  }

  @UseGuards(JwtAuthGuard)
  @Override()
  async createOne(
    @Request() request,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: EmissionReductioDraftDataEntity,
  ): Promise<EmissionReductioDraftDataEntity> {
    if (!dto.sector) {
      dto.sector = null;
    }

    return await this.base.createOneBase(req, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/dash')
  async getEmissionEeductionDraftDataForCountry(
    @Req() request: Request,
  ): Promise<EmissionReductioDraftDataEntity> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;

    [countryIdFromTocken, sectorIdFromTocken] = this.tokenDetails.getDetails([
      TokenReqestType.countryId,
      TokenReqestType.sectorId,
    ]);

    return await this.service.getEmissionEeductionDraftDataForCountry(
      countryIdFromTocken,
      sectorIdFromTocken,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/report')
  async getEmissionReductionDraftDataForReport(
    @Req() request: Request,
    @Query('sectorId') sectorId: number,
  ): Promise<EmissionReductioDraftDataEntity> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;

    [countryIdFromTocken, sectorIdFromTocken] = this.tokenDetails.getDetails([
      TokenReqestType.countryId,
      TokenReqestType.sectorId,
    ]);

    return await this.service.getEmissionReductionDraftDataForReport(
      sectorId,
      countryIdFromTocken,
      sectorIdFromTocken,
    );
  }
}
