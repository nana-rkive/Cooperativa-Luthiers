import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LuthierOrmEntity } from './modules/luthier/infrastructure/persistence/typeorm/luthier.orm-entity';
import { InstrumentoOrmEntity } from './modules/instrumento/infrastructure/persistence/typeorm/instrumento.orm-entity';
import { DatabaseModule } from './shared/database/typeorm.module';
import { LuthierModule } from './modules/luthier/luthier.module';

@Module({
  imports: [
    DatabaseModule, LuthierModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'cooperatica_luthiers.db',
      entities: [LuthierOrmEntity, InstrumentoOrmEntity],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
