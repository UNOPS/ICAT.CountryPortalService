import { Module } from '@nestjs/common';
import { ProjectOwnerService } from './project-owner.service';
import { ProjectOwnerController } from './project-owner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectOwner } from './projeect-owner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectOwner])],
  providers: [ProjectOwnerService],
  controllers: [ProjectOwnerController],
  exports: [ProjectOwnerService],
})
export class ProjectOwnerModule {}
