import {
  Body,
  Controller,
  Get,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { ParameterRequestService } from './data-request.service';
import { UpdateDeadlineDto } from './dto/dataRequest.dto';
import { ParameterRequest } from './entity/data-request.entity';
import { AuditService } from 'src/audit/audit.service';
import { AuditDto } from 'src/audit/dto/audit-dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiHeader } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';

@Crud({
  model: {
    type: ParameterRequest,
  },
  query: {
    join: {
      parameter: {
        eager: true,
      },
    },
  },
})
@Controller('parameter-request')
export class ParameterRequestController
  implements CrudController<ParameterRequest>
{
  constructor(
    private readonly tokenDetails: TokenDetails,
    public service: ParameterRequestService,
    private readonly auditService: AuditService,
  ) {}
  @Get('getDateRequestToManageDataStatus')
  async getDateRequestToManageDataStatus(
    @Request() request,

    @Query('assessmentId') assessmentId: number,
    @Query('assessmentYear') assessmentYear: number,
  ): Promise<any> {
    return await this.service.getDateRequestToManageDataStatus(
      assessmentId,
      assessmentYear,
    );
  }

  @UseGuards(LocalAuthGuard)
  @Get(
    'getNewDataRequest/:page/:limit/:filterText/:climateActionId/:year/:dataProvider',
  )
  @ApiHeader({
    name: 'api-key',
    schema: { type: 'string', default: process.env.API_KEY_1 },
  })
  @UseGuards(JwtAuthGuard)
  async getNewDataRequest(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('climateActionId') climateActionId: number,
    @Query('year') year: string,
    @Query('dataProvider') dataProvider: number,
  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;

    [countryIdFromTocken, sectorIdFromTocken] = this.tokenDetails.getDetails([
      TokenReqestType.countryId,
      TokenReqestType.sectorId,
    ]);

    return await this.service.getNewDataRequest(
      {
        limit: limit,
        page: page,
      },
      filterText,
      climateActionId,
      year,
      dataProvider,
      countryIdFromTocken,
      sectorIdFromTocken,
    );
  }

  @UseGuards(LocalAuthGuard)
  @Get(
    'getNewDataRequestForClimateList/:page/:limit/:filterText/:climateActionId/:year/:dataProvider',
  )
  @ApiHeader({
    name: 'api-key',
    schema: { type: 'string', default: process.env.API_KEY_1 },
  })
  @UseGuards(JwtAuthGuard)
  async getNewDataRequestForClimateList(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('climateActionId') climateActionId: number,
    @Query('year') year: string,
    @Query('dataProvider') dataProvider: number,
  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;

    [countryIdFromTocken, sectorIdFromTocken] = this.tokenDetails.getDetails([
      TokenReqestType.countryId,
      TokenReqestType.sectorId,
    ]);

    return await this.service.getNewDataRequestForClimateList(
      {
        limit: limit,
        page: page,
      },
      filterText,
      climateActionId,
      year,
      dataProvider,
      countryIdFromTocken,
      sectorIdFromTocken,
    );
  }

  @UseGuards(LocalAuthGuard)
  @Get(
    'getAssignDateRequest/:page/:limit/:filterText/:climateActionId/:userName',
  )
  @ApiHeader({
    name: 'api-key',
    schema: { type: 'string', default: process.env.API_KEY_1 },
  })
  async getAssignDateRequest(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('climateActionId') climateActionId: number,
    @Query('userName') userName: string,
  ): Promise<any> {
    return await this.service.getAssignDataRequest(
      {
        limit: limit,
        page: page,
      },
      filterText,
      climateActionId,
      userName,
    );
  }
  @UseGuards(LocalAuthGuard)
  @Get('getEnterDataRequest/:page/:limit/:filterText/:climateActionId/:year')
  @ApiHeader({
    name: 'api-key',
    schema: { type: 'string', default: process.env.API_KEY_1 },
  })
  async getEnterDataParameter(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('climateActionId') climateActionId: number,
    @Query('year') year: string,
    @Query('userName') userName: string,
  ): Promise<any> {
    return await this.service.getEnterDataParameter(
      {
        limit: limit,
        page: page,
      },
      filterText,
      climateActionId,
      year,
      userName,
    );
  }

  @UseGuards(LocalAuthGuard)
  @Get(
    'getReviewDataRequest/:page/:limit/:filterText/:climateActionId/:year/:type',
  )
  @ApiHeader({
    name: 'api-key',
    schema: { type: 'string', default: process.env.API_KEY_1 },
  })
  async getReviewDataRequest(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: string,
    @Query('climateActionId') climateActionId: number,
    @Query('year') year: string,
    @Query('type') type: string,
    @Query('userName') userName: string,
  ): Promise<any> {
    return await this.service.getReviewDataRequest(
      {
        limit: limit,
        page: page,
      },
      filterText,
      climateActionId,
      year,
      type,
      userName,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-deadline')
  updateDeadline(
    @Request() request,
    @Body() updateDeadlineDto: UpdateDeadlineDto,
  ): Promise<boolean> {
    const audit: AuditDto = new AuditDto();
    audit.action = 'Deadline Updated';
    audit.comment = 'Deadline Updated';
    audit.actionStatus = 'Updated';
    this.auditService.create(audit);

    return this.service.updateDeadlineForIds(updateDeadlineDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-deadline-dataEntry')
  updateDeadlineDataEntry(
    @Body() updateDeadlineDto: UpdateDeadlineDto,
  ): Promise<boolean> {
    const audit: AuditDto = new AuditDto();
    audit.action = 'Deadline Updated';
    audit.comment = updateDeadlineDto.comment + ' Updated';
    audit.actionStatus = 'Updated';
    this.auditService.create(audit);

    return this.service.updateDataEntryDeadlineForIds(updateDeadlineDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('accept-review-data')
  acceptReviewData(
    @Body() updateDeadlineDto: UpdateDeadlineDto,
  ): Promise<boolean> {
    const audit: AuditDto = new AuditDto();
    audit.action = 'Review Data Accepted';
    audit.comment = updateDeadlineDto.comment + ' Accepted';
    audit.actionStatus = 'Approved';

    this.auditService.create(audit);

    return this.service.acceptReviewDataForIds(updateDeadlineDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('reject-review-data')
  rejectReviewData(
    @Body() updateDeadlineDto: UpdateDeadlineDto,
  ): Promise<boolean> {
    const audit: AuditDto = new AuditDto();
    audit.action = 'Review Data Rejected';
    audit.comment = updateDeadlineDto.comment + ' Rejected';
    audit.actionStatus = 'Rejected';

    this.auditService.create(audit);

    return this.service.rejectReviewDataForIds(updateDeadlineDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('reject-enter-data')
  rejectEnterData(
    @Body() updateDeadlineDto: UpdateDeadlineDto,
  ): Promise<boolean> {
    const audit: AuditDto = new AuditDto();
    audit.action = 'Review Data Rejected';
    audit.comment = updateDeadlineDto.comment + ' Rejected';
    audit.actionStatus = 'Rejected';

    this.auditService.create(audit);
    return this.service.rejectEnterDataForIds(updateDeadlineDto);
  }

  @Get('climateaction/bydatRequestStatsu2')
  async getClimateActionByDataRequestStatus(
    @Request() request,
  ): Promise<any> {
    return await this.service.getClimateActionByDataRequestStatus();
  }

  @Get('climateaction/bydatRequestStatsusSix')
  async getClimateActionByDataRequestStatusSix(
    @Request() request,
  ): Promise<any> {
    return await this.service.getClimateActionByDataRequestStatusSix();
  }

  @Get('getQCpassParameterRequest/:parameteIds')
  async getQCpassParameterRequest(
    @Request() request,
    @Query('parameteIds') parameteIds:string[]
  ): Promise<any> {
    return parameteIds? await this.service.getQCpassParameterRequest(parameteIds):[];
  }


}
