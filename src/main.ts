
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.use(cookieParser()); // ✅ enable cookies

  const config = new DocumentBuilder()
    .setTitle('Security Service API')
    .setDescription('Validate user by token and realm')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // await app.listen(3001);
  await app.listen(3001, '0.0.0.0');

  console.log('http://localhost:3001/api/docs');
}
bootstrap();
