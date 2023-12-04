import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { CountrySector } from 'src/country/entity/country-sector.entity';
import { Repository } from 'typeorm';
import { SubSector } from '../sub-sector/entity/sub-sector.entity';
import { Sector } from './sector.entity';

@Injectable()
export class SectorService extends TypeOrmCrudService<Sector> {
  constructor(
    @InjectRepository(Sector) repo,
    @InjectRepository(CountrySector)
    private readonly CountrySectorRepo: Repository<CountrySector>,
  ) {
    super(repo);
  }

  async getSectorDetails(
    options: IPaginationOptions,
    filterText: string,
  ): Promise<Pagination<Sector>> {
    let filter = '';

    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(sr.name LIKE :filterText OR sr.description LIKE :filterText OR subsr.name LIKE :filterText)';
    }

    const data = this.repo
      .createQueryBuilder('sr')
      .leftJoinAndMapMany(
        'sr.subSector',
        SubSector,
        'subsr',
        'subsr.sectorId = sr.id',
      )

      .where(filter, {
        filterText: `%${filterText}%`,
      })
      .orderBy('sr.createdOn', 'DESC');

    const result = await paginate(data, options);

    if (result) {
      return result;
    }
  }

  async getCountrySector(countryId: number) {
    const result = [];
    const ids = await this.CountrySectorRepo.find({
      where: { country: countryId }, relations: ['country']
    });

    for await (const a of ids) {
      const sector = await this.repo.findOne({ where: { id: a.sectorId } });

      result.push(sector);
    }

    return result;
  }
}
