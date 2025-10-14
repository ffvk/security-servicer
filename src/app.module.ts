import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/User.module';

@Module({
  imports: [UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
