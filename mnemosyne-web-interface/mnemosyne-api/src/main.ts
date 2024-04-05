import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';
import * as yaml from 'yaml';
import { urlencoded, json } from 'express';
import { ImATeapotException } from '@nestjs/common';

(async () => {
  const whitelist = ['http://localhost:4201', 'https://proxy.mnemosyne.io'];

  const app = await NestFactory.create(AppModule, {
    cors: {
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
      credentials: true,
      origin: function (origin, callback) {
        console.log('origin API: ', origin);
        if (!origin) {
          callback(null, true);
          return;
        }
        if (whitelist.includes(origin) || !!origin.match(/mnemosyne\.io$/)) {
          console.log('Allowed CORS (API) for: ', origin);
          callback(null, true);
        } else {
          console.log('Blocked CORS (API) for: ', origin);
          callback(new ImATeapotException('Not allowed by CORS'), false);
        }
      }
    }
  });
  const port = process.env.API_PORT || 3000;

  app.setGlobalPrefix('/api');
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // app.enableCors({
  //   origin: 'https://proxy.mnemosyne.io',
  //   credentials: true
  // });

  // Working in the development mode
  // app.enableCors({
  //   origin: ['http://localhost:4201', 'https://proxy.mnemosyne.io'],
  //   credentials: true
  // });

  const config = new DocumentBuilder()
    .setTitle('Mnemosyne')
    .setDescription('Documentation of Mnemosyne API.')
    .setVersion('0.0.1')
    .addBearerAuth(
      {
        description:
          'Please enter the JWT token in the following format: Bearer <JWT>',
        name: 'x-access-token',
        type: 'apiKey',
        in: 'header'
      },
      'x-access-token'
    )
    .addBasicAuth(
      {
        description: 'Basic API authentication username and password',
        type: 'http',
        in: 'header'
      },
      'basicAuth'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const yamlString: string = yaml.stringify(document, {});

  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

  fs.writeFileSync('./docs/swagger-spec.json', JSON.stringify(document));
  fs.writeFileSync('./docs/swagger-spec.yaml', yamlString);

  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Mnemosyne | API Documentation'
  });

  await app.listen(port, () => {
    console.log(
      `Mnemosyne API has been successfully started on port: ${port}.`
    );
  });
})();
