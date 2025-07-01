import { Test, TestingModule } from '@nestjs/testing';
import { ParlayService } from './parlay.service';

describe('ParlayService', () => {
  let service: ParlayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParlayService],
    }).compile();

    service = module.get<ParlayService>(ParlayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
