import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { AuditService } from 'src/audit/audit.service';
import { AuditDto } from 'src/audit/dto/audit-dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateValueEnterData } from './dto/updateValueEnterData.dto';
import { Parameter } from './entity/parameter.entity';
import { ParameterService } from './parameter.service';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { editFileName, excelFileFilter } from './file-upload.utils';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';

@Crud({
  model: {
    type: Parameter,
  },
  query: {
    join: {
      institution: {
        eager: true,
      },
      assessment: {
        eager: true,
      },
      verificationDetail: {
        eager: true,
      },
      defaultValue: {
        eager: true,
      },
    },
  },
})
@Controller('parameter')
export class ParameterController implements CrudController<Parameter> {
  constructor(
    public service: ParameterService,
    private readonly auditService: AuditService,
    private readonly tokenDetails: TokenDetails,
  ) {}

  @Get('parameter/parameterByAssessment/:assessmentId')
  async parameterByAssessment(
    @Request() request,
    @Query('assessmentId') assessmentId: number,
  ): Promise<any> {
    return await this.service.getParameterByAssessment(assessmentId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('parameter/GetParameterHistoryForQA/:name')
  async GetParameterHistoryForQA(@Query('name') name: string) {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;

    [countryIdFromTocken, sectorIdFromTocken] = this.tokenDetails.getDetails([
      TokenReqestType.countryId,
      TokenReqestType.sectorId,
    ]);

    return await this.service.GetParameterHistoryForQA(
      name,
      countryIdFromTocken,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('parameter/ia')
  async GetParameterForIaDash(): Promise<Parameter[]> {
    let institutionIdFromTocken: number;

    [institutionIdFromTocken] = this.tokenDetails.getDetails([
      TokenReqestType.InstitutionId,
    ]);

    return await this.service.GetParameterForIaDash(institutionIdFromTocken);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-value')
  updateDeadline(
    @Body() updateValueDto: UpdateValueEnterData,
  ): Promise<boolean> {
    const audit: AuditDto = new AuditDto();
    audit.action = 'Review Data Updated';
    audit.comment = updateValueDto.value + ' Updated';
    audit.actionStatus = 'Updated';

    this.auditService.create(audit);

    return this.service.updateEnterDataValue(updateValueDto);
  }

  @Put('update-institution')
  updateInstitution(
    @Body() updateValueDto: UpdateValueEnterData,
  ): Promise<boolean> {
    return this.service.updateInstitution(updateValueDto);
  }

  @Put('update-alternative')
  @ApiBody({ type: [Parameter] })
  updateParameterAlternative(
    @Body() parameters: Parameter[],
  ): Promise<boolean> {
    return this.service.updateParameterAlternative(parameters);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: excelFileFilter,
    }),
  )
  async uploadFileExcel(@UploadedFile() file) {
    const newSavedfile = file.filename;
    await this.service.uplaodFileUpload(newSavedfile);
  }
}
