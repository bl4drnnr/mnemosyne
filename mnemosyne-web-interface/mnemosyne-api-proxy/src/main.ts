import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as yaml from 'yaml';
import * as bodyParser from 'body-parser';
import { urlencoded, json } from 'express';
import { ImATeapotException } from '@nestjs/common';

(async () => {
  const whitelist = ['http://localhost:4200', 'https://mnemosyne.io'];

  const app = await NestFactory.create(AppModule, {
    cors: {
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
      credentials: true,
      origin: function (origin, callback) {
        console.log('origin API Proxy: ', origin);
        if (!origin) {
          callback(null, true);
          return;
        }
        if (whitelist.includes(origin) || !!origin.match(/mnemosyne\.io$/)) {
          console.log('Allowed CORS (API Proxy) for: ', origin);
          callback(null, true);
        } else {
          console.log('Blocked CORS (API Proxy) for: ', origin);
          callback(new ImATeapotException('Not allowed by CORS'), false);
        }
      }
    }
  });
  const port = process.env.PROXY_PORT;

  app.setGlobalPrefix('/api');
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // app.enableCors({
  //   allowedHeaders: ['content-type'],
  //   origin: 'https://mnemosyne.io',
  //   credentials: true
  // });

  // Working in the development mode
  // app.enableCors({
  //   origin: ['http://localhost:4200', 'https://mnemosyne.io'],
  //   credentials: true
  // });

  const config = new DocumentBuilder()
    .setTitle('Mnemosyne')
    .setDescription('Documentation of Mnemosyne Proxy API.')
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const yamlString: string = yaml.stringify(document, {});

  fs.writeFileSync('./docs/swagger-spec.json', JSON.stringify(document));
  fs.writeFileSync('./docs/swagger-spec.yaml', yamlString);

  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

  SwaggerModule.setup('docs', app, document);

  await app.listen(port, () => {
    console.log(`Front proxy API has been started on port ${port}`);
  });
})();
