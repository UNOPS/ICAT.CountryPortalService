import {
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CrudController } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
import { QuAlityCheckStatus } from './entity/quality-check-status.entity';
import { QualityCheckService } from './quality-check.service';

@UseGuards(JwtAuthGuard)
@Controller('quality-check')
export class QualityCheckController
  implements CrudController<ParameterRequest>
{
  constructor(
    public service: QualityCheckService,
    private readonly tokenDetails: TokenDetails,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(
    'quality-check/GetQCParameters/:page/:limit/:statusId/:filterText/:ndcId/:subNdcId',
  )
  async GetQCParameters(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('statusId') statusId: number,
    @Query('filterText') filterText: string,
    @Query('ndcId') ndcId: number,
    @Query('subNdcId') subNdcId: number,
    @Query('ctAction') ctAction: string,
  ): Promise<any> {
    let countryIdFromTocken: number;
    [countryIdFromTocken] = this.tokenDetails.getDetails([
      TokenReqestType.countryId,
    ]);

    return await this.service.GetQCParameters(
      {
        limit: limit,
        page: page,
      },
      filterText,
      statusId,
      ndcId,
      subNdcId,
      countryIdFromTocken,
      ctAction,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(
    'quality-check/UpdateQCStatus/:paramId/:assessmentYearId/:qaStatusId/:comment/:userQc',
  )
  async UpdateQCStatus(
    @Query('paramId') paramId: number,
    @Query('assessmentYearId') assessmentYearId: number,
    @Query('qaStatusId') qaStatusId: number,
    @Query('comment') comment: string,
    @Query('userQc') userQc: string,
  ): Promise<any> {
    return this.service.UpdateQCStatus(
      paramId,
      assessmentYearId,
      QuAlityCheckStatus[QuAlityCheckStatus[qaStatusId]],
      comment,
      userQc,
    );
  }
}
