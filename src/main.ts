import { NestFactory } from '@nestjs/core';
import { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import * as YAML from 'yamljs';
import * as path from 'path';
const fs = require('fs');

import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use((req: Request, res: Response, next: NextFunction) => {
  //   res.setHeader('Content-Type', 'application/json');
  //   next();
  // });
  // const filePath = path.join(__dirname, '..', 'doc', 'api.yaml');
  // const swaggerDocument = YAML.load(fs.readFileSync(filePath, 'utf8'));

  // SwaggerModule.setup('api', app, swaggerDocument);

  await app.listen(process.env.PORT);
}
bootstrap();
