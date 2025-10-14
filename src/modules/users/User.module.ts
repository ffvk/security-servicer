import { Module } from '@nestjs/common';
import { UsersController } from './User.controller';
import { UsersService } from './User.service';


@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
