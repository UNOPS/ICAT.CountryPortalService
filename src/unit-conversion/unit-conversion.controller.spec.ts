import { Test, TestingModule } from '@nestjs/testing';
import { UnitConversionController } from './unit-conversion.controller';

describe('UnitConversionController', () => {
  let controller: UnitConversionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitConversionController],
    }).compile();

    controller = module.get<UnitConversionController>(UnitConversionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
