import { Test, TestingModule } from '@nestjs/testing';
import { EmissionReductionDraftdataController } from './emission-reduction-draftdata.controller';

describe('EmissionReductionDraftdataController', () => {
  let controller: EmissionReductionDraftdataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmissionReductionDraftdataController],
    }).compile();

    controller = module.get<EmissionReductionDraftdataController>(
      EmissionReductionDraftdataController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
