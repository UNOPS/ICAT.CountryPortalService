import { Test, TestingModule } from '@nestjs/testing';
import { AssementApplicabilityController } from './assement-applicability.controller';

describe('AssementApplicabilityController', () => {
  let controller: AssementApplicabilityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssementApplicabilityController],
    }).compile();

    controller = module.get<AssementApplicabilityController>(
      AssementApplicabilityController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
