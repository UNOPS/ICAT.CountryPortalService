import { Module } from '@nestjs/common';
import { ProjectionYearService } from './projection-year.service';

@Module({
  providers: [ProjectionYearService],
})
export class ProjectionYearModule {}
