import { Test, TestingModule } from '@nestjs/testing';
import { MatchupsService } from './matchups.service';

describe('MatchupsService', () => {
  let service: MatchupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchupsService],
    }).compile();

    service = module.get<MatchupsService>(MatchupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
