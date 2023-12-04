import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { request } from 'http';
import { Methodology } from './entity/methodology.entity';
import { MethodologyService } from './methodology.service';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Crud({
  model: {
    type: Methodology,
  },
  query: {
    join: {
      country: {
        eager: true,
      },
      assessments: {
        eager: true,
      },
      methodologySubsection: {
        eager: true,
      },
      ndc: {
        eager: true,
      },
      subNdc: {
        eager: true,
      },
      mitigationActionType: {
        eager: true,
      },
      applicability: {
        eager: true,
      },
      sector: {
        eager: true,
      },
      method: {
        eager: true,
      },
    },
  },
})
@Controller('methodology')
export class MethodologyController implements CrudController<Methodology> {
  constructor(
    public service: MethodologyService,
    private readonly tokenDetails: TokenDetails,
  ) {}

  get base(): CrudController<Methodology> {
    return this;
  }

  @UseGuards(JwtAuthGuard)
  @Get('methodology/methodologyinfo/:page/:limit/:filterText')
  async getMethoDetails(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;

    [countryIdFromTocken, sectorIdFromTocken] = this.tokenDetails.getDetails([
      TokenReqestType.countryId,
      TokenReqestType.sectorId,
    ]);

    return await this.service.getMethodologyDetails(
      {
        limit: limit,
        page: page,
      },
      filterText,
      countryIdFromTocken,
      sectorIdFromTocken,
    );
  }
}
