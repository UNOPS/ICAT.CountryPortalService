import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CountrySector } from 'src/country/entity/country-sector.entity';
import { Repository } from 'typeorm';
import { SubSector } from '../sub-sector/entity/sub-sector.entity';
import { Sector } from './sector.entity';

@Injectable()
export class SectorService extends TypeOrmCrudService<Sector> {
  constructor(
    @InjectRepository(Sector) repo,
    @InjectRepository(CountrySector)
    private readonly CountrySectorRepo: Repository<CountrySector>,) {
    super(repo);
  }


  async getSectorDetails(
    options: IPaginationOptions,
    filterText: string,
  ): Promise<Pagination<Sector>> {
    let filter: string = '';
    // let fDate = `${editedOn.getFullYear()}-${editedOn.getMonth()+1}-${editedOn.getDate()}`;

    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        // '(dr.climateActionName LIKE :filterText OR dr.description LIKE :filterText)';
        '(sr.name LIKE :filterText OR sr.description LIKE :filterText OR subsr.name LIKE :filterText)';
    }


    /*
    if (sectorId != 0) {
      if (filter) {
        filter = `${filter}  and sr.sectorId = :sectorId`;
      } else {
        filter = `dr.sectorId = :sectorId`;
      }
    }

    if (statusId != 0) {
      if (filter) {
        filter = `${filter}  and dr.projectStatusId = :statusId`;
      } else {
        filter = `dr.projectStatusId = :statusId`;
      }
    }

    if (mitigationActionTypeId != 0) {
      if (filter) {
        filter = `${filter}  and dr.mitigationActionTypeId = :mitigationActionTypeId`;
      } else {
        filter = `dr.mitigationActionTypeId = :mitigationActionTypeId`;
      }
    }
*/
    let data = this.repo
      .createQueryBuilder('sr')
      .leftJoinAndMapMany('sr.subSector', SubSector, 'subsr', 'subsr.sectorId = sr.id')


      .where(filter, {
        filterText: `%${filterText}%`,

      })
      .orderBy('sr.createdOn', 'DESC');
    // console.log(
    //   '=====================================================================',
    // );
    // console.log(data.getQuery());

    let resualt = await paginate(data, options);

    if (resualt) {
      return resualt;
    }
  }



  async getCountrySector(countryId: number) {
    // console.log('countryId', countryId);
    let resualt = new Array()
    let ids = await this.CountrySectorRepo.find({ where: { countryId: countryId } });
    // console.log('ids', ids);

    for await (let a of ids) {
      let sector = await this.repo.findOne({ where: { id: a.sectorId } });
      // console.log('sector', sector);
      resualt.push(sector);
    }

    // console.log('resualt', resualt);
    return resualt;



  }
}
