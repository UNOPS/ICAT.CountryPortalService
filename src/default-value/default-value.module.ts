import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { Institution } from 'src/institution/institution.entity';
import { Parameter } from 'src/parameter/entity/parameter.entity';
import { TokenDetails } from 'src/utills/token_details';
import { DefaultValueController } from './default-value.controller';
import { DefaultValueService } from './default-value.service';
import { DefaultValue } from './entity/defaultValue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DefaultValue,Parameter,Institution,ParameterRequest])],
  controllers: [DefaultValueController],
  providers: [DefaultValueService,Parameter,Institution,ParameterRequest,TokenDetails,],
  exports: [DefaultValueService,Parameter,Institution,ParameterRequest],
})
export class DefaultValueModule {}
