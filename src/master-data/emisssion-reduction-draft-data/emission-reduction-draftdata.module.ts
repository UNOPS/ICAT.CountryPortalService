import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { TokenDetails } from 'src/utills/token_details';

import { EmissionReductionDraftdataController } from './emission-reduction-draftdata.controller';
import { EmissionReductionDraftdataService } from './emission-reduction-draftdata.service';
import { EmissionReductioDraftDataEntity } from './entity/emission-reductio-draft-data.entity';
@Module({
  imports: [TypeOrmModule.forFeature([EmissionReductioDraftDataEntity,User])],
  controllers: [EmissionReductionDraftdataController],
  providers: [EmissionReductionDraftdataService,TokenDetails],
  exports: [EmissionReductionDraftdataService],
})
export class EmissionReductionDraftdataModule {}
