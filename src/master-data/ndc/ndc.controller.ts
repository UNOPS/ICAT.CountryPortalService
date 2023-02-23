import { Controller, Get, Query } from '@nestjs/common';
import { Ndc } from './ndc.entity';
import { NdcService } from './ndc.service';
import { Request, UseGuards } from '@nestjs/common';
import {
  Crud,
  CrudController,
  Override,
  ParsedRequest,
  CrudRequest,
  GetManyDefaultResponse,
} from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';

@Crud({
  model: {
    type: Ndc,
  },
  query: {
    join: {
      set: {
        eager: true,
      },
      country: {
        eager: true,
      },
      sector: {
        eager: true,
      },
      subNdc: {
        eager: true,
      },
      assessment: {
        eager: true,
      },
    },
  },
})
@Controller('ndc')
export class NdcController implements CrudController<Ndc> {
  constructor(
    public service: NdcService,
    private readonly tokenDetails: TokenDetails,
  ) {}

  get base(): CrudController<Ndc> {
    return this;
  }

  @Override()
  async getMany(
    @ParsedRequest() req: CrudRequest,
    @Request() req2,
  ): Promise<GetManyDefaultResponse<Ndc> | Ndc[]> {
    try {
      const res = await this.base.getManyBase(req);

      return res;
    } catch (error) {}
  }
  @UseGuards(JwtAuthGuard)
  @Get('ndc/ndcinfo/:page/:limit/:sectorIds')
  async getDateRequest(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sectorIds') sectorIds: string[],
  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;

    [countryIdFromTocken, sectorIdFromTocken] = this.tokenDetails.getDetails([
      TokenReqestType.countryId,
      TokenReqestType.sectorId,
    ]);

    return await this.service.ndcSectorDetails(
      {
        limit: limit,
        page: page,
      },
      sectorIds,
      countryIdFromTocken,
      sectorIdFromTocken,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('ndcSectorDetailsDashboard')
  async ndcSectorDetailsDashboard(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sectorIds') sectorId: number,
  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;

    [countryIdFromTocken, sectorIdFromTocken] = this.tokenDetails.getDetails([
      TokenReqestType.countryId,
      TokenReqestType.sectorId,
    ]);

    return await this.service.ndcSectorDetailsDashboard(
      {
        limit: limit,
        page: page,
      },
      sectorId,
      countryIdFromTocken,
      sectorIdFromTocken,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('getNdcForDashboard')
  async getNdcForDashboard(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sectorId') sectorId: number,
  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;
    let moduleLevelsFromTocken: number[];

    [countryIdFromTocken, sectorIdFromTocken, moduleLevelsFromTocken] =
      this.tokenDetails.getDetails([
        TokenReqestType.countryId,
        TokenReqestType.sectorId,
        TokenReqestType.moduleLevels,
      ]);

    return await this.service.getNdcForDashboard(
      {
        limit: limit,
        page: page,
      },
      sectorId,
      countryIdFromTocken,
      sectorIdFromTocken,
      moduleLevelsFromTocken,
    );
  }
}
