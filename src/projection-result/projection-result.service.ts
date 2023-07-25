import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Assessment } from 'src/assessment/entity/assessment.entity';
import { QuAlityCheckStatus } from 'src/quality-check/entity/quality-check-status.entity';
import { ProjectionResult } from './entity/projection-result.entity';

@Injectable()
export class ProjectionResultService extends TypeOrmCrudService<ProjectionResult> {
  constructor(@InjectRepository(ProjectionResult) repo) {
    super(repo);
  }

  async updateQCStatus(
    id: number,
    assessmentyearId: number,
    qcStatus: QuAlityCheckStatus,
    comment: string,
  ) {
    const result = await this.repo.findOne(id);
    result.qcComment = comment;
    result.qcStatus = qcStatus;
    const projectioResultTo = this.repo.save(result);
    return projectioResultTo;
  }

  async GetProjectionResult(
    assessmentId: number,
    projectionYear: number,
  ): Promise<any> {
    const assessment = new Assessment();
    assessment.id = assessmentId;

    const assessmentResult = await this.repo.find({
      where: { assessment: assessment },
    });

    return assessmentResult;
  }

  async checkAllQCApprovmentProjectionResult(assementId: number): Promise<boolean> {

    let result = await this.repo
      .createQueryBuilder('dr')
      .where('dr.assementId=:assementId', {
        assementId
      }).getOne();
    if (result) {
      if (result.qcStatus == 4) {
        return true
      }
      return false
    }

    return true;
  }
}
