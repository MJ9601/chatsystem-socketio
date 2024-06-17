import { ChatEntity, MessageEntity, UserEntity } from '../entities';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  port: +process.env.POSTGRES_PORT ?? 5432,
  database: process.env.POSTGRES_DB ?? 'manshor',
  username: process.env.POSTGRES_USER ?? 'postgres',
  password: process.env.POSTGRES_PASSWORD ?? 'password',
  host: process.env.POSTGRES_HOST_DEV ?? 'localhost',
  entities: [UserEntity, ChatEntity, MessageEntity],
  migrations: [__dirname + '/migration/*.ts'],
  subscribers: [],
};

export const dataSource = new DataSource(dataSourceOptions);
