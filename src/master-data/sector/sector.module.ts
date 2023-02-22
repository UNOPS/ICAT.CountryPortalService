import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountrySector } from 'src/country/entity/country-sector.entity';
import { SectorController } from './sector.controller';
import { Sector } from './sector.entity';
import { SectorService } from './sector.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sector, CountrySector])],
  controllers: [SectorController],
  providers: [SectorService, CountrySector],
  exports: [SectorService],
})
export class SectorModule {}
