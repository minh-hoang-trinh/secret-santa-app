import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DrawsModule } from '../src/app/draws/draws.module';
import { DatabaseModule } from '../src/database/database.module';
import { AuthModule } from '../src/app/auth/auth.module';

describe('Auth guard (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, DatabaseModule, DrawsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it.each([['/draws'], ['/draws/1'], ['/draws/1/results']])(
    'should return 401 when not authenticated',
    (path) => {
      return request(app.getHttpServer()).get(path).expect(401);
    }
  );
});
