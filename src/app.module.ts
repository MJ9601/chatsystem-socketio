import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './db/typeorm/data-source';
import { UserEntity, ChatEntity, MessageEntity } from './db/entities';
import { SocketGatewayModule } from './socket-gateway/socket-gateway.module';
import { MessageModule } from './message/message.module';
import { ChatModule } from './chat/chat.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        ...dataSourceOptions,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserEntity, ChatEntity, MessageEntity]),
    SocketGatewayModule,
    MessageModule,
    ChatModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
