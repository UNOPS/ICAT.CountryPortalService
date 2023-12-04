import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { Parameter } from 'src/parameter/entity/parameter.entity';
import { ParameterHistory } from './entity/parameter-history.entity';
import { ParameterHistoryController } from './parameter-history.controller';
import { ParameterHistoryService } from './parameter-history.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ParameterHistory, Parameter, ParameterRequest]),
  ],
  controllers: [ParameterHistoryController],
  providers: [ParameterHistoryService],
  exports: [ParameterHistoryService],
})
export class ParameterHistoryModule {}
