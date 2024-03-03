import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as yaml from 'yaml';
import * as bodyParser from 'body-parser';

(async () => {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PROXY_PORT;

  app.setGlobalPrefix('/api');

  const whitelist = [
    'http://localhost:4200',
    'https://mnemosyne.io',
    'http://mnemosyne.io',
    'http://api.mnemosyne.io',
    'https://api.mnemosyne.io'
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

  // app.enableCors({
  //   origin: [
  //     'http://localhost:4200',
  //     'https://mnemosyne.io',
  //     'http://mnemosyne.io',
  //     'http://api.mnemosyne.io',
  //     'https://api.mnemosyne.io'
  //   ],
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
