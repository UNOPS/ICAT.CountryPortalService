import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectorController } from './sector.controller';
import { Sector } from './sector.entity';
import { SectorService } from './sector.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sector])],
  controllers: [SectorController],
  providers: [SectorService],
  exports: [SectorService],
})
export class SectorModule {}
