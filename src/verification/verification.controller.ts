import { Body, Controller, Get, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
import { VerificationDetail } from './entity/verification-detail.entity';
import { VerificationService } from './verification.service';

@Crud({
  model: {
    type: VerificationDetail,
  },
})
@Controller('verification')
export class VerificationController
  implements CrudController<ParameterRequest>
{
  constructor(public service: VerificationService,
    private readonly tokenDetails:TokenDetails,
    ) {}


  @UseGuards(JwtAuthGuard)
  @Get('verification/GetVRParameters/:page/:limit/:statusId/:filterText')
  async GetVRParameters(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('statusId') statusId: number,
    @Query('filterText') filterText: string,
  ): Promise<any> {

    let countryIdFromTocken:number ;
    [countryIdFromTocken] =    this.tokenDetails.getDetails([TokenReqestType.countryId])
   

    return await this.service.GetVRParameters(
      {
        limit: limit,
        page: page,
      },
      filterText,
      statusId,
      countryIdFromTocken,
    );
  }

  @Get('verification/GetVerificationDetails/:assesmentYearId')
  async GetVerificationDetails(
    @Query('assesmentYearId') assesmentYearId: number,
  ) {
    return await this.service.GetVerificationDetails(assesmentYearId);
  }

  @Put('verification/SaveVerificationDetails')
  @ApiBody({ type: [VerificationDetail] })
  async SaveVerificationDetails(
    @Body() verificationDetail: VerificationDetail[],
  ): Promise<boolean> {
    verificationDetail.map((a) =>
      a.parameter?.id === undefined ? (a.parameter = null) : 1 + 1,
    );
    await this.service.SaveVerificationDetail(verificationDetail);
    return true;
  }
}
