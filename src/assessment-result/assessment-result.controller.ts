import {
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { Assessment } from 'src/assessment/entity/assessment.entity';
import { AuditService } from 'src/audit/audit.service';
import { AuditDto } from 'src/audit/dto/audit-dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { QuAlityCheckStatus } from 'src/quality-check/entity/quality-check-status.entity';
import { Repository } from 'typeorm';
import { AssessmentResultService } from './assessment-result.service';
import { AssessmentResult } from './entity/assessment-result.entity';
import { AssessmentResultType } from './entity/assessment-result-type.entity';
import { getConnection } from 'typeorm';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';

@Crud({
  model: {
    type: AssessmentResult,
  },
  query: {
    join: {
      assessment: {
        eager: true,
      },
      assessmentYear: {
        eager: true,
      },
      projectionResult: {
        eager: true,
      },
    },
  },
})
@Controller('assessment-result')
export class AssessmentResultController
  implements CrudController<AssessmentResult>
{
  constructor(
    public service: AssessmentResultService,
    @InjectRepository(Assessment)
    public assessmentRepo: Repository<Assessment>,
    private readonly auditService: AuditService,
    private readonly tokenDetails: TokenDetails,
  ) {}

  get base(): CrudController<AssessmentResult> {
    return this;
  }

  @UseGuards(LocalAuthGuard)
  @Get(
    'assessment-result/GetAssessmentResult/:AssessmentId/:AssessmentYearId/:calculate',
  )
  @ApiHeader({
    name: 'api-key',
    description: 'A Custom Header',
    schema: { type: 'string', default: '1234' },
  })
  async GetAssessmentResult(
    @Query('AssessmentId') AssessmentId: number,
    @Query('AssessmentYearId') AssessmentYearId: number,
    @Query('calculate') calculate: boolean,
  ) {
    const restult = await this.service.GetAssessmentResult(
      AssessmentId,
      AssessmentYearId,
      calculate,
    );

    return restult;
  }

  @Get('assessment-result/GetAllAssessmentResult/:AssessmentYearId')
  async GetAllAssessmentResult(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('AssessmentYearId') AssessmentYearId: number,
  ) {
    const restult = await this.service.GetAllAssessmentResult(
      {
        limit: limit,
        page: page,
      },
      AssessmentYearId,
    );

    return restult;
  }

  @Post(
    'assessment-result/updateQCStatusAssessmentResult/:resultId/:yearId/:qcStatus/:assessmentResultType/:comment',
  )
  @UseGuards(JwtAuthGuard)
  async updateQCStatusAssessmentResult(
    @Query('resultId') resultId: number,
    @Query('yearId') yearId: number,
    @Query('qcStatus') qcStatus: number,
    @Query('assessmentResultType') assessmentResultType: number,
    @Query('comment') comment: string,
  ): Promise<AssessmentResult> {
    const audit: AuditDto = new AuditDto();
    audit.action = 'QC Status Assessment Result Updated';
    audit.comment = 'QC Status Assessment Result Updated';
    audit.actionStatus = 'Updated';

    this.auditService.create(audit);

    return await this.service.updateQCStatus(
      resultId,
      yearId,
      QuAlityCheckStatus[QuAlityCheckStatus[qcStatus]],
      AssessmentResultType[AssessmentResultType[assessmentResultType]],
      comment,
    );
  }

  @Get('macassessment-result/qcupdate/:yearId/:qcStatus')
  async UpdateQcStatusForMac(
    @Query('yearId') yearId: number,
    @Query('qcStatus') qcStatus: number,
  ) {
    return await this.service.updateQCStatusforMac(yearId, qcStatus);
  }
  @Get('checkAllQCApprovmentAssessmentResult')
  async checkAllQCApprovmentAssessmentResult(
    @Query('assersltId') assersltId: number,
  ): Promise<boolean> {
    return await this.service.checkAllQCApprovmentAssessmentResult(assersltId);
  }

  @Get('macassessment-result/verificationupdate/:yearId/:VRStatus')
  async UpdateVRStatusForMac(
    @Query('yearId') yearId: number,
    @Query('VRStatus') VRStatus: number,
  ) {
    return await this.service.updateVRStatusforMac(yearId, VRStatus);
  }

  @Override()
  async createOne(
    @Request() request,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: AssessmentResult,
  ): Promise<AssessmentResult> {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const asr = await queryRunner.manager.save(AssessmentResult, dto);

      const assessment = await this.assessmentRepo.findOne(asr.assessment.id);
      assessment.macValue = asr.macResult;

      await queryRunner.manager.save(Assessment, assessment);

      await queryRunner.commitTransaction();
      return asr;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return err;
    } finally {
      await queryRunner.release();
    }
  }

  @Get('trackpage/assessmentsResults/byAssessmentId/:id')
  async getAssessmentResultBYAssessmentId(
    @Request() request,
    @Query('id') id: number,
  ): Promise<any> {
    return await this.service.getAssessmentResultBYAssessmentId(id);
  }
  @UseGuards(JwtAuthGuard)
  @Get('dashboaremission')
  async getAssessmentResultforDashboard(
    @Request() request,
    @Query('assesYear') assesYear: number,
  ): Promise<any> {
    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;
    let institutionIdFromTocken: number;
    let moduleLevelsFromTocken: number[];
    [
      countryIdFromTocken,
      sectorIdFromTocken,
      institutionIdFromTocken,
      moduleLevelsFromTocken,
    ] = this.tokenDetails.getDetails([
      TokenReqestType.countryId,
      TokenReqestType.sectorId,
      TokenReqestType.InstitutionId,
      TokenReqestType.moduleLevels,
    ]);
    return await this.service.getAssessmentResultforDashboard(
      assesYear,
      countryIdFromTocken,
      sectorIdFromTocken,
      moduleLevelsFromTocken,
    );
  }
}
