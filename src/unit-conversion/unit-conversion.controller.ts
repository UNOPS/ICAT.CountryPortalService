import { Controller, Get, Query } from '@nestjs/common';
import { CrudController } from '@nestjsx/crud';
import { UnitConversion } from './entity/unit-conversion.entity';
import { UnitConversionService } from './unit-conversion.service';

@Controller('unit-conversion')
export class UnitConversionController
  implements CrudController<UnitConversion>
{
  constructor(public service: UnitConversionService) {}

  get base(): CrudController<UnitConversion> {
    return this;
  }

  @Get('getUnitTypes/:toUnit')
  async getUnitTypes(@Query('toUnit') toUnit: string): Promise<any> {
    return await this.service.findAll(toUnit);
  }
}
