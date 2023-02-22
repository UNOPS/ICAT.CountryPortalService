import { Test, TestingModule } from '@nestjs/testing';
import { AssementApplicabilityService } from './assement-applicability.service';

describe('AssementApplicabilityService', () => {
  let service: AssementApplicabilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssementApplicabilityService],
    }).compile();

    service = module.get<AssementApplicabilityService>(
      AssementApplicabilityService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
