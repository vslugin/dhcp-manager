import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import initDb from './db';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const configService = app.get(ConfigService);
  const PORT = configService.get<string>('SERVER_PORT') || 5000;
  initDb()
  await app.listen(PORT, '0.0.0.0');
  const url = await app.getUrl();
  console.log(`server started at ${url}`);
}
bootstrap();
