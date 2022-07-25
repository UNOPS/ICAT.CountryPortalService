import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenDetails } from 'src/utills/token_details';
import { NdcSetController } from './ndc-set.controller';
import { NdcSet } from './ndc-set.entity';
import { NdcSetService } from './ndc-set.service';
import { NdcController } from './ndc.controller';
import { Ndc } from './ndc.entity';
import { NdcService } from './ndc.service';
import { SubNdcController } from './sub-ndc.controller';
import { SubNdc } from './sub-ndc.entity';
import { SubNdcService } from './sub-ndc.service';


@Module({
  imports: [TypeOrmModule.forFeature([Ndc, SubNdc, NdcSet])],
  controllers: [NdcController, NdcSetController, SubNdcController],
  providers: [NdcService, NdcSetService, SubNdcService,TokenDetails],
  exports: [NdcService],
})
export class NdcModule {}
