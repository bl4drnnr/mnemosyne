import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = process.env.PROXY_PORT;

  app.setGlobalPrefix('/api');

  await app.listen(port, () => {
    console.log(`Front proxy API has been started on port ${port}`);
  });
})();
