import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

export async function createTestApp(): Promise<{
  app: INestApplication;
  close: () => Promise<void>;
}> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();

  return {
    app,
    close: async () => {
      await app.close();
    },
  };
}
