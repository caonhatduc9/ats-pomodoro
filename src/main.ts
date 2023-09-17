import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  const corsOptions: CorsOptions = {
    origin: ['http://localhost:3000', 'http://pomodoro.atseeds.com', 'https://pomodoro.atseeds.com'], // add rontend url here
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true,
  };
  app.enableCors(corsOptions);
  await app.listen(7200);
}


bootstrap();
