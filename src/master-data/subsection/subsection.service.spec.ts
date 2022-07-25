import { Test, TestingModule } from '@nestjs/testing';
import { SubsectionService } from './subsection.service';

describe('SubsectionService', () => {
  let service: SubsectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubsectionService],
    }).compile();

    service = module.get<SubsectionService>(SubsectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
