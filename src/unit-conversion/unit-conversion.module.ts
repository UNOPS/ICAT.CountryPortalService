import { UnitConversion } from './entity/unit-conversion.entity';
import { Module } from '@nestjs/common';
import { UnitConversionController } from './unit-conversion.controller';
import { UnitConversionService } from './unit-conversion.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UnitConversion])],
  controllers: [UnitConversionController],
  providers: [UnitConversionService],
  exports: [UnitConversionService],
})
export class UnitConversionModule {}
