import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancingSchemeController } from './financing-scheme.controller';
import { FinancingScheme } from './financing-scheme.entity';
import { FinancingSchemeService } from './financing-scheme.service';

@Module({
  imports: [TypeOrmModule.forFeature([FinancingScheme])],
  controllers: [FinancingSchemeController],
  providers: [FinancingSchemeService],
  exports: [FinancingSchemeService],
})
export class FinancingSchemeModule {}
