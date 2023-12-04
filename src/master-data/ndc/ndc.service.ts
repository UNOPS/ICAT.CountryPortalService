import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { AssessmentResult } from 'src/assessment-result/entity/assessment-result.entity';
import { Assessment } from 'src/assessment/entity/assessment.entity';
import { Project } from 'src/project/entity/project.entity';
import { Ndc } from './ndc.entity';
import { SubNdc } from './sub-ndc.entity';

@Injectable()
export class NdcService extends TypeOrmCrudService<Ndc> {
  constructor(@InjectRepository(Ndc) repo) {
    super(repo);
  }

  async ndcSectorDetails(
    options: IPaginationOptions,
    sectorIds: string[],
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
  ): Promise<Pagination<any>> {
    let filter = '';

    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and dr.countryId = :countryIdFromTocken`;
      } else {
        filter = `dr.countryId = :countryIdFromTocken`;
      }
    }

    if (sectorIdFromTocken) {
      if (filter) {
        filter = `${filter}  and dr.sectorId = :sectorIdFromTocken  `;
      } else {
        filter = `dr.sectorId = :sectorIdFromTocken`;
      }
    } else {
      if (sectorIds && sectorIds.length > 0) {
        if (filter) {
          filter = `${filter}  and dr.sectorId  IN  (:...sectorIds) `;
        } else {
          filter = `dr.sectorId IN  (:...sectorIds) `;
        }
      }
    }

    const data = this.repo
      .createQueryBuilder('dr')

      .where(filter, {
        sectorIds,
        countryIdFromTocken,
        sectorIdFromTocken,
      })
      .orderBy('dr.createdOn', 'ASC');

    const result = await paginate(data, options);

    if (result) {
      return result;
    }
  }

  async ndcSectorDetailsDashboard(
    options: IPaginationOptions,
    sectorId: number,
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
  ): Promise<Pagination<any>> {
    let filter = '';

    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and dr.countryId = :countryIdFromTocken`;
      } else {
        filter = `dr.countryId = :countryIdFromTocken`;
      }
    }

    if (sectorIdFromTocken) {
      if (filter) {
        filter = `${filter}  and dr.sectorId = :sectorIdFromTocken  `;
      } else {
        filter = `dr.sectorId = :sectorIdFromTocken`;
      }
    } else {
      if (sectorId != 0) {
        if (filter) {
          filter = `${filter}  and dr.sectorId = :sectorId`;
        } else {
          filter = `dr.sectorId = :sectorId`;
        }
      }
    }

    const data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapMany('dr.subNdc', SubNdc, 'sub', 'sub.ndcId = dr.id')
      .innerJoinAndMapMany('dr.project', Project, 'pro', 'pro.ndcId = dr.id')
      .where(filter, {
        sectorId,
        countryIdFromTocken,
        sectorIdFromTocken,
      })
      .orderBy('dr.createdOn', 'ASC');

    const result = await paginate(data, options);

    if (result) {
      return result;
    }
  }

  async getNdcForDashboard(
    options: IPaginationOptions,
    sectorId: number,
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
    moduleLevelsFromTocken: number[],
  ): Promise<Pagination<any>> {
    let filter = '';

    if (moduleLevelsFromTocken[3] == 1 || moduleLevelsFromTocken[4] == 1) {
      if (filter) {
        filter = `${filter}   and asse.isProposal= false `;
      } else {
        filter = `asse.isProposal= false`;
      }
    } else if (
      moduleLevelsFromTocken[1] == 1 ||
      moduleLevelsFromTocken[2] == 1
    ) {
      if (filter) {
        filter = `${filter}  and  asse.isProposal= true and proj.projectApprovalStatusId in (1,4) `;
      } else {
        filter = `asse.isProposal= true and proj.projectApprovalStatusId in (1,4) `;
      }
    } else {
      if (filter) {
        filter = `${filter}  and  asse.isProposal= false `;
      } else {
        filter = `asse.isProposal= false`;
      }
    }

    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and proj.countryId = :countryIdFromTocken`;
      } else {
        filter = `proj.countryId = :countryIdFromTocken`;
      }
    }

    if (sectorIdFromTocken) {
      if (filter) {
        filter = `${filter}  and proj.sectorId = :sectorIdFromTocken  `;
      } else {
        filter = `proj.sectorId = :sectorIdFromTocken`;
      }
    } else {
      if (sectorId && sectorId != 0) {
        if (filter) {
          filter = `${filter}  and proj.sectorId = :sectorId`;
        } else {
          filter = `proj.sectorId = :sectorId`;
        }
      }
    }

    const data = this.repo
      .createQueryBuilder('ndc')
      .select([
        'ndc.id',
        'ndc.name',
        'asse.id as asseId',
        'asseRslt.id as asseRsltId ',
        'asseRslt.totalEmission ',
        'proj.projectApprovalStatusId',
      ])
      .innerJoinAndMapMany(
        'ndc.assessment',
        Assessment,
        'asse',
        'asse.ndcId = ndc.id and asse.assessmentType = "Ex-post"',
      )
      .innerJoinAndMapOne(
        'asse.project',
        Project,
        'proj',
        'asse.projectId = proj.id ',
      )
      .innerJoinAndMapMany(
        'asse.assessmentResult',
        AssessmentResult,
        'asseRslt',
        'asseRslt.assessmentId = asse.id ',
      )
      .where(filter, {
        sectorId,
        countryIdFromTocken,
        sectorIdFromTocken,
      })
      .orderBy('ndc.createdOn', 'ASC');

    const result = await paginate(data, options);

    if (result) {
      return result;
    }
  }
}
