import { Module } from '@nestjs/common';
import { SocketGateway } from './gateway';
import { ChatModule } from 'src/chat/chat.module';
import { UsersModule } from 'src/users/users.module';
import { MessageModule } from 'src/message/message.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [SocketGateway],
  imports: [
    ChatModule,
    UsersModule,
    MessageModule,

    JwtModule.register({
      secret: process.env.SECRET ?? 'secret',
      signOptions: { expiresIn: '60min' },
    }),
  ],
})
export class SocketGatewayModule {}
