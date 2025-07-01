import { Test, TestingModule } from '@nestjs/testing';
import { ParlayController } from './parlay.controller';

describe('ParlayController', () => {
  let controller: ParlayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParlayController],
    }).compile();

    controller = module.get<ParlayController>(ParlayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
