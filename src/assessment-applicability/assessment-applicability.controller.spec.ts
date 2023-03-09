import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentApplicabilityController } from './assessment-applicability.controller';

describe('AssessmentApplicabilityController', () => {
  let controller: AssessmentApplicabilityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssessmentApplicabilityController],
    }).compile();

    controller = module.get<AssessmentApplicabilityController>(
      AssessmentApplicabilityController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
