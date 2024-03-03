import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';
import * as yaml from 'yaml';

(async () => {
  const app = await NestFactory.create(AppModule);
  const port = process.env.API_PORT || 3000;

  app.setGlobalPrefix('/api');

  const whitelist = [
    'http://localhost:4200',
    'https://mnemosyne.io',
    'http://mnemosyne.io',
    'http://proxy.mnemosyne.io',
    'https://proxy.mnemosyne.io'
  ];

  app.enableCors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        console.log("allowed cors for:", origin)
        callback(null, true)
      } else {
        console.log("blocked cors for:", origin)
        callback(new Error('Not allowed by CORS'))
      }
    }
  });

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
