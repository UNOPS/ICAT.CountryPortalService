import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { TrackcaEntity } from './entity/trackca.entity';

@Injectable()
export class TrackClimateService extends TypeOrmCrudService<TrackcaEntity> {
  constructor(@InjectRepository(TrackcaEntity) repo) {
    super(repo);
  }

  // async getTrackClimateActionDetails(
  //   countryIdFromTocken:number
  // ): Promise<Pagination<TrackcaEntity>> {

  //   if (countryIdFromTocken != 0) {
  //     if (filter) {
  //       filter = `${filter}  and dr.countryId = :countryIdFromTocken`;
  //     } else {
  //       filter = `dr.countryId = :countryIdFromTocken`;
  //     }
  //   }

  //   // if (sectorId != 0) {
  //   //   if (filter) {
  //   //     filter = `${filter}  and dr.sectorId = :sectorId`;
  //   //   } else {
  //   //     filter = `dr.sectorId = :sectorId`;
  //   //   }
  //   // }

  //   let data = this.repo
  //     .createQueryBuilder('trca')
  //     .leftJoinAndMapOne('dr.sector', Sector, 'sec', 'sec.id = dr.sectorId')
  //     .leftJoinAndMapOne('dr.country', Country, 'cou', 'cou.id = dr.countryId')
  //     .leftJoinAndMapOne('dr.institution', Institution, 'ins', 'ins.id = dr.mappedInstitutionId')
  //     .leftJoinAndMapOne(
  //       'dr.mitigationAction',
  //       MitigationActionType,
  //       'mit',
  //       'mit.id = dr.mitigationActionTypeId',
  //     )
  //     .leftJoinAndMapOne(
  //       'dr.projectStatus',
  //       ProjectStatus,
  //       'pst',
  //       'pst.id = dr.projectStatusId',
  //     )
  //     .leftJoinAndMapOne(
  //       'dr.projectApprovalStatus',
  //       ProjectApprovalStatus,
  //       'past',
  //       'dr.projectApprovalStatusId = past.id',
  //     )
  //     //   .innerJoinAndMapOne('dr.user', User, 'u', 'dr.userId = u.id')

  //     .where(filter, {
  //       filterText: `%${filterText}%`,
  //       mitigationActionTypeId,
  //       sectorId,
  //       statusId,
  //       editedOn,
  //       countryIdFromTocken,
  //       sectorIdFromTocken
  //     })
  //     .orderBy('dr.createdOn', 'DESC');
  //   // console.log(
  //   //   '=====================================================================',
  //   // );
  //   // console.log(data.getQuery());

  //   let resualt = await paginate(data, options);

  //   if (resualt) {
  //     return resualt;
  //   }
  // }
}
