import { Test, TestingModule } from '@nestjs/testing';
import { MatchupsController } from './matchups.controller';
import { MatchupsService } from './matchups.service';

describe('MatchupsController', () => {
  let controller: MatchupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchupsController],
      providers: [MatchupsService],
    }).compile();

    controller = module.get<MatchupsController>(MatchupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
