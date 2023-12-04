import { Test, TestingModule } from '@nestjs/testing';
import { ApplicabilityController } from './applicability.controller';

describe('ApplicabilityController', () => {
  let controller: ApplicabilityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicabilityController],
    }).compile();

    controller = module.get<ApplicabilityController>(ApplicabilityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
