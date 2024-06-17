import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEntity, Room, UserEntity } from 'src/db/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async createPublicRoom(username: string, userId: number) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });

      const newChat = this.chatRepository.create({
        username,
        roomType: Room.public,
        users: [user],
      });

      const savedChat = await this.chatRepository.save(newChat);

      return savedChat;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async getChatByNameWithUsers(username: string) {
    try {
      const chat = await this.chatRepository.findOne({
        where: { username },
        relations: ['users'],
      });

      return chat;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async createPrivateRoom(username: string, userId: number) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });

      const newChat = this.chatRepository.create({
        username,
        roomType: Room.private,
        users: [user],
      });

      const savedChat = await this.chatRepository.save(newChat);

      return savedChat;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async getOneRoom(id: number) {
    try {
      const chat = await this.chatRepository.findOneBy({ id });
      return chat;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async getAllRooms(query?: any) {
    try {
      const chats = await this.chatRepository.find({
        where: { ...(query && query) },
      });

      return chats;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async removeOneRoom(id: number) {
    try {
      await this.chatRepository.softDelete({ id });
      return 'room removed!!';
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async updateOneRoom(id: number, input: any) {
    try {
      const updatedRoom = await this.chatRepository.update(id, {
        ...(input && input),
      });
      return updatedRoom;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async removeUserFromRoom(userIds: number[], roomName: string) {
    try {
      const chat = await this.chatRepository.findOne({
        where: { username: roomName },
        relations: ['users'],
      });
      if (chat) {
        userIds.forEach((id) => {
          chat.users = chat.users.filter((u) => u.id !== id);
        });

        return this.chatRepository.save(chat);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async addUserToRoom(userIds: number[], roomName: string) {
    try {
      const users = await Promise.all(
        userIds.map(async (id) => await this.userRepository.findOneBy({ id })),
      );
      const chat = await this.chatRepository.findOne({
        where: { username: roomName },
        relations: ['users'],
      });
      if (chat) {
        chat.users.push(...users);
        return this.chatRepository.save(chat);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
