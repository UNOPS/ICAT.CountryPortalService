import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { AuditService } from 'src/audit/audit.service';
import { AuditDto } from 'src/audit/dto/audit-dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { QuAlityCheckStatus } from 'src/quality-check/entity/quality-check-status.entity';
import { ProjectionResult } from './entity/projection-result.entity';
import { ProjectionResultService } from './projection-result.service';

@Crud({
  model: {
    type: ProjectionResult,
  },
  query: {
    join: {
      assessment: {
        eager: true,
      },
      assessmentResult: {
        eager: true,
      },
    },
  },
})
@Controller('projection-result')
export class ProjectionResultController
  implements CrudController<ProjectionResult>
{
  constructor(
    public service: ProjectionResultService,
    private readonly auditService: AuditService,
  ) {}

  get base(): CrudController<ProjectionResult> {
    return this;
  }

  @UseGuards(JwtAuthGuard)
  @Post('projection-result/updateQCStatus/:resultId/:yearId/:qcStatus/:comment')
  async updateQCStatus(
    @Query('resultId') resultId: number,
    @Query('yearId') yearId: number,
    @Query('qcStatus') qcStatus: number,
    @Query('comment') comment: string,
  ): Promise<any> {
    const audit: AuditDto = new AuditDto();
    audit.action = 'QC Status Updated';
    audit.comment = 'QC Status Updated';
    audit.actionStatus = 'Updated';
    this.auditService.create(audit);

    return await this.service.updateQCStatus(
      resultId,
      yearId,
      QuAlityCheckStatus[QuAlityCheckStatus[qcStatus]],
      comment,
    );
  }

  @Get('projection-result/GetProjectionResult/:AssessmentId/:ProjectionYear')
  async GetProjectionResult(
    @Query('AssessmentId') AssessmentId: number,
    @Query('ProjectionYear') ProjectionYear: number,
  ) {
    const restult = await this.service.GetProjectionResult(
      AssessmentId,
      ProjectionYear,
    );

    return restult;
  }

  @Get('checkAllQCApprovmentProjectionResult')
  async checkAllQCApprovmentProjectionResult(
    @Query('assessmentId') assessmentId: number,

  ): Promise<boolean> {
    return await this.service.checkAllQCApprovmentProjectionResult(
      assessmentId
    );
  }
}
