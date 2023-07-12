import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Assessment } from 'src/assesment/entity/assesment.entity';
import { QuAlityCheckStatus } from 'src/quality-check/entity/quality-check-status.entity';
import { ProjectionResault } from './entity/projection-resault.entity';

@Injectable()
export class ProjectionResaultService extends TypeOrmCrudService<ProjectionResault> {
  constructor(@InjectRepository(ProjectionResault) repo) {
    super(repo);
  }

  async updateQCStatus(
    id: number,
    assesmentyearId: number,
    qcStatus: QuAlityCheckStatus,
    comment: string,
  ) {
    var result = await this.repo.findOne(id);
    result.qcComment = comment;
    result.qcStatus = qcStatus;
    let projectioResultTo = this.repo.save(result);
    return projectioResultTo;
  }

  async GetProjectionResult(
    assesmentId: number,
    projectionYear: number,
  ): Promise<any> {
    let assement = new Assessment();
    assement.id = assesmentId;

    let assessmentResault = await this.repo.find({
      where: { assement: assement },
    });

    return assessmentResault;
  }


  async checkAllQCApprovmentProjectionResult(assementId:number):Promise<boolean>{

    let result =await this.repo
    .createQueryBuilder('dr')
  
    .where('dr.assementId=:assementId', {
      assementId
    }).getOne();
    console.log('checkAllQCApprovmentAssessmentResult', assementId)
    console.log('checkAllQCApprovmentAssessmentResult', result)
    if(result){
      if(result.qcStatus==4){
        return true
      }

      return false
    }

return true;
  }
}
