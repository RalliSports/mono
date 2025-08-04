import { Test, TestingModule } from '@nestjs/testing';
import { AthletesService } from './athletes.service';

describe('AthletesService', () => {
  let service: AthletesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AthletesService],
    }).compile();

    service = module.get<AthletesService>(AthletesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
