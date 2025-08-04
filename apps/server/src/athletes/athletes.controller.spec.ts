import { Test, TestingModule } from '@nestjs/testing';
import { AthletesController } from './athletes.controller';
import { AthletesService } from './athletes.service';

describe('AthletesController', () => {
  let controller: AthletesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AthletesController],
      providers: [AthletesService],
    }).compile();

    controller = module.get<AthletesController>(AthletesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
