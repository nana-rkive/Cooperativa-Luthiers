import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionFilter } from './shared/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (validationErrors = []) => {
      const errors = validationErrors.reduce((acc, error) => {
        acc[error.property] = Object.values(error.constraints || {});
        return acc;
      }, {} as Record<string, string[]>);
      return new BadRequestException({ statusCode: 400, message: 'Erro de validação', errors });
    },
  }));

  const config = new DocumentBuilder()
    .setTitle('Cooperativa de Luthiers')
    .setDescription(
      'API para gerenciamento de luthiers e instrumentos.\n\n' +
      '**Autenticação:** Faça login em `POST /auth/login` para obter o `accessToken` ' +
      'e clique em **Authorize** para inserir o token no formato `Bearer <token>`.',
    )
    .setVersion('1.0')
    .addTag('Autenticação', 'Registro, login e ativação de conta')
    .addTag('Luthiers', 'CRUD de luthiers — requer autenticação JWT')
    .addTag('Instrumentos', 'CRUD de instrumentos — requer autenticação JWT')
    .addTag('Usuários', 'Gestão de usuários — requer role admin')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Insira o token JWT obtido em POST /auth/login',
      },
      'bearer', // nome do esquema — deve coincidir com @ApiBearerAuth() nos controllers
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // mantém o token entre reloads da página
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
