import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenDetails } from 'src/utills/token_details';
import { Methodology } from './entity/methodology.entity';
import { MethodologyController } from './methodology.controller';
import { MethodologyService } from './methodology.service';

@Module({
  imports: [TypeOrmModule.forFeature([Methodology])],
  controllers: [MethodologyController],
  providers: [MethodologyService, TokenDetails],
  exports: [MethodologyService],
})
export class MethodologyModule {}
