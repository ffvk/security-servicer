import { Realm } from 'src/modules/users/dto/Realm';
import { UserAttribute } from 'src/modules/users/dto/User-Attribute';
import { UserEntity } from 'src/modules/users/dto/User-Entity';
import { DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const getTypeOrmConfig = (configService: ConfigService): DataSourceOptions => ({
  type: 'postgres',
  url: configService.get<string>('DATABASE_URL'),
  entities: [UserEntity, UserAttribute, Realm],
  synchronize: false, // never true on production
  logging: false,
});
