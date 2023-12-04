import { Test, TestingModule } from '@nestjs/testing';
import { UnitConversionService } from './unit-conversion.service';

describe('UnitConversionService', () => {
  let service: UnitConversionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnitConversionService],
    }).compile();

    service = module.get<UnitConversionService>(UnitConversionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
