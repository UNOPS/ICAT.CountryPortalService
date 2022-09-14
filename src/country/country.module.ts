import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sector } from 'src/master-data/sector/sector.entity';
import { TokenDetails } from 'src/utills/token_details';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';
import { CountrySector } from './entity/country-sector.entity';
import { Country } from './entity/country.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Country,CountrySector,Sector])],
    controllers: [CountryController],
    providers: [CountryService,CountrySector,Sector,TokenDetails],
    exports: [CountryService],
})
export class CountryModule {}
