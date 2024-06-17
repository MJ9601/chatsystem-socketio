import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { serviceIds } from 'src/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity, UserEntity } from 'src/db/entities';
import { UsersModule } from 'src/users/users.module';
import { ChatController } from './chat.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ChatEntity])],
  providers: [
    {
      useClass: ChatService,
      provide: serviceIds.chatService,
    },
  ],
  exports: [serviceIds.chatService],
  controllers: [ChatController],
})
export class ChatModule {}
