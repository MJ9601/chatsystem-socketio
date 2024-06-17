import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { serviceIds } from 'src/constants';
import { ChatService } from './chat.service';
import { JwtGuard } from 'src/guards/jwt.gruard';
import { GetUser } from 'src/decorators/getUser';
import { UserEntity } from 'src/db/entities';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Chats')
@UseGuards(JwtGuard)
@Controller('chats')
export class ChatController {
  constructor(
    @Inject(serviceIds.chatService) private readonly chatService: ChatService,
  ) {}

  @ApiOperation({ summary: 'create public chat' })
  @ApiResponse({ status: 201, description: 'create public room' })
  @Post('public')
  async createPublicChatHandler(
    @Body() input: any,
    @GetUser() user: Omit<UserEntity, 'password'>,
  ) {
    try {
      const { username } = input;
      const pubChat = await this.chatService.createPublicRoom(
        username,
        user.id,
      );
      return pubChat;
    } catch (error) {
      return error;
    }
  }

  @ApiOperation({ summary: 'create private chat' })
  @ApiResponse({ status: 201, description: 'create private room' })
  @Post('private')
  async createPrivateChatHandler(
    @Body() input: any,
    @GetUser() user: Omit<UserEntity, 'password'>,
  ) {
    try {
      const { username } = input;
      const pubChat = await this.chatService.createPrivateRoom(
        username,
        user.id,
      );
      return pubChat;
    } catch (error) {
      return error;
    }
  }

  @ApiOperation({ summary: 'get chat' })
  @ApiResponse({ status: 200, description: 'return room info' })
  @Get(':chatName')
  async getChatHandler(@Param('chatName') chatName: string) {
    try {
      const pubChat = await this.chatService.getChatByNameWithUsers(chatName);
      return pubChat;
    } catch (error) {
      return error;
    }
  }

  @ApiOperation({ summary: 'get all chat' })
  @ApiResponse({ status: 200, description: 'return rooms info' })
  @Get('all')
  async getAllChatHandler(@Query() query: any) {
    try {
      const pubChat = await this.chatService.getAllRooms(query);
      return pubChat;
    } catch (error) {
      return error;
    }
  }
}
