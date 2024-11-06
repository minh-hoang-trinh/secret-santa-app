import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import request from 'supertest';
import { DrawsModule } from '../src/app/draws/draws.module';
import { DatabaseModule } from '../src/database/database.module';
import { AuthModule } from '../src/app/auth/auth.module';
import { AuthGuard } from '../src/app/auth/auth.guard';
import { seedTheOffice } from '../src/database/prisma/the-office-x-mas';
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import { DrawOwnerGuard } from '../src/app/draws/draw-owner.guard';

describe('/draws (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, DatabaseModule, DrawsModule],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest();
          request['user'] = { sub: 'admin' };

          return true;
        },
      })
      .overrideGuard(DrawOwnerGuard)
      .useValue({
        canActivate: () => true,
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  beforeEach(async () => {
    execSync('npx prisma migrate reset --force --skip-seed');
    await seedTheOffice();
  });

  it(`/GET draws`, async () => {
    return request(app.getHttpServer())
      .get('/draws')
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          draws: [
            {
              id: expect.any(String),
              name: 'The Office xMas 2024',
              ownerId: 'michael-scott',
              status: 'OPEN',
              participants: expect.arrayContaining(['michael-scott']),
            },
          ],
          skip: 0,
          take: 5,
          total: 1,
        });
      });
  });

  describe(`/POST draws/:drawId/start & /GET draws/:drawId/`, () => {
    it('should be able to start a draw and get the results', async () => {
      const drawId =
        (await prisma.draw.findFirst({ select: { id: true } }))?.id ??
        'unknown';

      await request(app.getHttpServer())
        .post(`/draws/${drawId}/start`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual({
            drawId: expect.any(String),
            status: 'COMPLETED',
          });
        });

      await request(app.getHttpServer())
        .get(`/draws/${drawId}/results`)
        .expect(200)
        .then(({ body: { results } }) => {
          expect(results.length).toEqual(20);
        });
    });
  });

  describe('/POST draws', () => {
    it('should be able to create a draw', async () => {
      await request(app.getHttpServer())
        .post('/draws')
        .send({ name: 'New draw' })
        .expect(201)
        .then(({ body }) => {
          expect(body).toEqual({
            id: expect.any(String),
          });
        });
    });
  });

  describe('/PUT draws/:drawId/blacklist', () => {
    it('should be able to update the blacklist', async () => {
      const {
        body: { id: drawId },
      } = await request(app.getHttpServer())
        .post('/draws')
        .send({ name: 'New draw' })
        .expect(201);

      await request(app.getHttpServer())
        .put(`/draws/${drawId}/blacklist`)
        .send({ blacklistUserIds: ['michael-scott', 'jim-halpert'] })
        .expect(200);

      await request(app.getHttpServer())
        .get(`/draws/${drawId}/blacklist`)
        .expect(200)
        .then(({ body: { blacklist } }) => {
          expect(blacklist.sort()).toEqual(['jim-halpert', 'michael-scott']);
        });
    });
  });
});
