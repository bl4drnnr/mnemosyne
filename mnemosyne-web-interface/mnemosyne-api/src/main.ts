import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';
import * as yaml from 'yaml';
import { ValidationPipe } from '@pipes/validation.pipe';

(async () => {
  const app = await NestFactory.create(AppModule);
  const port = process.env.API_PORT || 3000;

  app.setGlobalPrefix('/api');

  const config = new DocumentBuilder()
    .setTitle('Mnemosyne')
    .setDescription('Documentation of Mnemosyne API.')
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const yamlString: string = yaml.stringify(document, {});

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.useGlobalPipes(new ValidationPipe());

  fs.writeFileSync('./docs/swagger-spec.json', JSON.stringify(document));
  fs.writeFileSync('./docs/swagger-spec.yaml', yamlString);

  SwaggerModule.setup('docs', app, document);

  await app.listen(port, () => {
    console.log(
      `Mnemosyne API has been successfully started on port: ${port}.`
    );
  });
})();
