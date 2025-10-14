import { Module } from '@nestjs/common';
import { UsersController } from './User.controller';
import { UsersService } from './User.service';
import { DatabaseModule } from 'src/config/database.module';


@Module({
imports: [DatabaseModule], // ✅ This is needed for DI
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
