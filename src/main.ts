import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NextFunction, json, urlencoded,Response  } from 'express';
import 'dotenv/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule , { cors: true });
  const option = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true
  };
  app.enableCors(option);
  app.use(function (request: Request, response: Response, next: NextFunction) {
    response.setHeader('Access-Control-Allow-Origin', 'https://tracad.unops.org');
    next();
  });
  const options = new DocumentBuilder()
    .setTitle('ICAT')
    .setDescription('ICAT')
    .setVersion('1.0')
    .addTag('ICAT')
    .addCookieAuth('optional-session-id')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  await app.listen(parseInt(process.env.PORT) || 8080);
}
bootstrap();