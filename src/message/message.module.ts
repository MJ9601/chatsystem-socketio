import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { serviceIds } from 'src/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity, MessageEntity, UserEntity } from 'src/db/entities';
import { MessageController } from './message.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity, UserEntity, ChatEntity])],
  providers: [
    {
      useClass: MessageService,
      provide: serviceIds.msgService,
    },
  ],
  exports: [serviceIds.msgService],
  controllers: [MessageController],
})
export class MessageModule {}
