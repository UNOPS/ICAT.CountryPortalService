import { Test, TestingModule } from '@nestjs/testing';
import { SubsectionController } from './subsection.controller';

describe('SubsectionController', () => {
  let controller: SubsectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubsectionController],
    }).compile();

    controller = module.get<SubsectionController>(SubsectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
