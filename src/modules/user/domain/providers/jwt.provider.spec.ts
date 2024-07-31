import { Test, TestingModule } from '@nestjs/testing';
import { JWTProviderInterface } from './jwt.provider';

describe('JwtProvider', () => {
  let provider: JWTProviderInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
    }).compile();

  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
