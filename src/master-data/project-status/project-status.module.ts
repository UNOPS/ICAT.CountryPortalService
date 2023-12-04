import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectStatusController } from './project-status.controller';
import { ProjectStatus } from './project-status.entity';
import { ProjectStatusService } from './project-status.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectStatus])],
  controllers: [ProjectStatusController],
  providers: [ProjectStatusService],
  exports: [ProjectStatusService],
})
export class ProjectStatusModule {}
