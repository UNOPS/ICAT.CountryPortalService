import {
  Controller,
  Get,
  Inject,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Crud, CrudController } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';

import { LearningMaterial } from './entity/learning-material.entity';
import { LearningMaterialService } from './learning-material.service';

@Crud({
  model: {
    type: LearningMaterial,
  },
  query: {
    join: {
      userType: {
        eager: true,
      },
      sector: {
        eager: true,
      },
    },
  },
})
@Controller('learning-material')
export class LearningMaterialController
  implements CrudController<LearningMaterial>
{
  constructor(
    public service: LearningMaterialService,
    private readonly tokenDetails: TokenDetails,
  ) {}

  get base(): CrudController<LearningMaterial> {
    return this;
  }

  @UseGuards(JwtAuthGuard)
  @Get(
    'learning-material/learning-materialinfo/:page/:limit/:filterText/:typeId/:sectorId/:sortOrder/:sortType',
  )
  async getLearningMaterialDetails(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,

    @Query('sortOrder') sortOrder: number,
    @Query('sortType') sortType: number,
  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;
    let institutionIdFromTocken: number;
    let userRole: string;

    [
      countryIdFromTocken,
      sectorIdFromTocken,
      institutionIdFromTocken,
      userRole,
    ] = this.tokenDetails.getDetails([
      TokenReqestType.countryId,
      TokenReqestType.sectorId,
      TokenReqestType.InstitutionId,
      TokenReqestType.role,
    ]);

    return await this.service.getlearningmaterialdetails(
      {
        limit: limit,
        page: page,
      },
      filterText,

      sortOrder,
      sortType,
      countryIdFromTocken,
      sectorIdFromTocken,
      institutionIdFromTocken,
      userRole,
    );
  }
}
