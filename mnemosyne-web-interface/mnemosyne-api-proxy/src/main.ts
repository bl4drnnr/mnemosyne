import * as cors from 'cors';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as yaml from 'yaml';
import * as bodyParser from 'body-parser';
import { urlencoded, json } from 'express';

(async () => {
  const whitelist = [
    'http://localhost:4200',
    'https://mnemosyne.io',
    'https://proxy.mnemosyne.io',
    'http://mnemosyne.io',
    'http://proxy.mnemosyne.io'
  ];

  const app = await NestFactory.create(AppModule);
  const port = process.env.PROXY_PORT;

  app.setGlobalPrefix('/api');
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // app.enableCors({
  //   allowedHeaders: ['Content-Type', 'Authorization', 'X-Access-Token'],
  //   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  //   credentials: true,
  //   origin: function (origin, callback) {
  //     if (whitelist.indexOf(origin) !== -1) {
  //       console.log('allowed cors for (API Proxy):', origin);
  //       callback(null, true);
  //     } else {
  //       console.log('blocked cors for:', origin);
  //       callback(new Error('Not allowed by CORS (API Proxy)'));
  //     }
  //   }
  // });

  app.use(cors({
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Access-Token'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        const message = `allowed cors for (API Proxy): ${origin}\n`;
        fs.appendFile('cors_logs.txt', message, (err) => {
          if (err) throw err;
          console.log('Cors log appended to file');
        });
        callback(null, true);
      } else {
        const message = `blocked cors for (API Proxy): ${origin}\n`;
        fs.appendFile('cors_logs.txt', message, (err) => {
          if (err) throw err;
          console.log('Cors log appended to file');
        });
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }));

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
