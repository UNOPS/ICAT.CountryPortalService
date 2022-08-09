import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { AuditService } from 'src/audit/audit.service';
import { AuditDto } from 'src/audit/dto/audit-dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { QuAlityCheckStatus } from 'src/quality-check/entity/quality-check-status.entity';
import { ProjectionResault } from './entity/projection-resault.entity';
import { ProjectionResaultService } from './projection-resault.service';

@Crud({
  model: {
    type: ProjectionResault,
  },
  query: {
    join: {
      assement: {
        eager: true,
      },
      assementResult:{
        eager: true,
      },
    },
  },
})
@Controller('projection-resault')
export class ProjectionResaultController
  implements CrudController<ProjectionResault>
{
  constructor(
    public service: ProjectionResaultService,
    private readonly auditService: AuditService,
  ) {}

  get base(): CrudController<ProjectionResault> {
    return this;
  }

  @UseGuards(JwtAuthGuard)
  @Post(
    'projection-resault/updateQCStatus/:resultId/:yearId/:qcStatus/:comment',
  )
  async updateQCStatus(
    @Query('resultId') resultId: number,
    @Query('yearId') yearId: number,
    @Query('qcStatus') qcStatus: number,
    @Query('comment') comment: string,
  ):Promise<any> {
    let audit: AuditDto = new AuditDto();
    audit.action = 'QC Status Updated';
    audit.comment = 'QC Status Updated';
    audit.actionStatus = 'Updated';
    this.auditService.create(audit);
    console.log('QC Status Updated');
    console.log('*******************');
    return await this.service.updateQCStatus(
      resultId,
      yearId,
      QuAlityCheckStatus[QuAlityCheckStatus[qcStatus]],
      comment,
    );
  }

  @Get('projection-resault/GetProjectionResult/:AssessmentId/:ProjectionYear')
  async GetProjectionResult(
    @Query('AssessmentId') AssessmentId: number,
    @Query('ProjectionYear') ProjectionYear: number,
  ) {
    let restult = await this.service.GetProjectionResult(
      AssessmentId,
      ProjectionYear,
    );
    // console.log('dddddddddddddddddddddddddddddddddd');
    console.log('AssessmentId-----', AssessmentId);
    console.log('ProjectionYear-----', ProjectionYear);
    console.log('projection-resault-----', restult);
    return restult;
  }
}
