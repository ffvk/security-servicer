import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './database.service';

@Module({
  imports: [ConfigModule], // don't need isGlobal here if already in AppModule
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
