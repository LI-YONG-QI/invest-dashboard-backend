import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  app.use(
    session({
      name: 'siwe-quickstart',
      secret: 'siwe-quickstart-secret',
      resave: true,
      saveUninitialized: true,
      cookie: { secure: false, sameSite: true },
    }),
  );

  await app.listen(3000);
}
bootstrap();
