import { Module } from '@nestjs/common';
import { SubSectorService } from './sub-sector.service';

@Module({
  providers: [SubSectorService]
})
export class SubSectorModule {}
