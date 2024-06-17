import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEntity, MessageEntity, UserEntity } from 'src/db/entities';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
  ) {}

  public async getChatMessages(chatName: string) {
    try {
      const chatWithMsgs = await this.chatRepository.findOne({
        where: { username: chatName },
        relations: ['messages'],
      });
      return chatWithMsgs;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async getMessages(query?: any) {
    try {
      const messages = await this.messageRepository.find({
        where: { ...(query && query) },
      });
      return messages;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async getOneMessage(id: number) {
    try {
      const message = await this.messageRepository.findOneBy({ id });
      return message;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async createMessage(text: string, userId: number, chatName: string) {
    try {
      const [chat, user] = await Promise.all([
        this.chatRepository.findOneBy({ username: chatName }),
        this.userRepository.findOneBy({ id: userId }),
      ]);
      const newMsg = this.messageRepository.create({ text, chat, user });
      const savedMsg = await this.messageRepository.save(newMsg);
      return savedMsg;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async updateMessage(msgId: number, text: string, userId: number) {
    try {
      const updatedMsg = await this.messageRepository.update(
        { id: msgId },
        { text },
      );
      return updatedMsg;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async removeMessage() {}
}
