import { Test, TestingModule } from '@nestjs/testing';
import { INestsolution } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/AppModule';

describe('AppController (e2e)', () => {
  let app: INestsolution;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestsolution();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
  });
});
