import { Test, TestingModule } from '@nestjs/testing';
import { ApplicabilityService } from './applicability.service';

describe('ApplicabilityService', () => {
  let service: ApplicabilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicabilityService],
    }).compile();

    service = module.get<ApplicabilityService>(ApplicabilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
