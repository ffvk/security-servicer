import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/User.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database.module';
@Module({
  imports: [
        ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
