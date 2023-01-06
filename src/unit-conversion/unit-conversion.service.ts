import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { UnitConversion } from './entity/unit-conversion.entity';

@Injectable()
export class UnitConversionService extends TypeOrmCrudService<UnitConversion> {
  constructor(@InjectRepository(UnitConversion) repo) {
    super(repo);
  }

  async findAll(toUnit: string): Promise<string[]> {
    if (toUnit) {
      return await this.repo
        .createQueryBuilder('ur')
        .select('ur.fromUnit')
        .where('ur.toUnit=:toUnit', { toUnit })
        .distinct(true)
        .getRawMany();
    }
    return await this.repo
      .createQueryBuilder('ur')
      .select('ur.fromUnit')
      .distinct(true)
      .getRawMany();
  }

  findByUnit(fromUnit: string, toUnit: string): Promise<UnitConversion> {
    return this.repo.findOne({ where: { fromUnit: fromUnit, toUnit: toUnit } });
  }
}
