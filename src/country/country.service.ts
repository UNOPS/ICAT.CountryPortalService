import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Sector } from 'src/master-data/sector/sector.entity';
import { Repository } from 'typeorm';
import { CountrySector } from './entity/country-sector.entity';
import { Country } from './entity/country.entity';

@Injectable()
export class CountryService extends TypeOrmCrudService<Country> {
  constructor(
    @InjectRepository(Country) repo,
    @InjectRepository(CountrySector)
    private readonly CountrySectorRepo: Repository<CountrySector>,
    @InjectRepository(Sector)
    private readonly SectorRepo: Repository<Sector>,
  ) {
    super(repo);
  }
}
