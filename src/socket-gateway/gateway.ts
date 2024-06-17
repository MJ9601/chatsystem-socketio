import { Inject, OnModuleInit, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from 'src/chat/chat.service';
import { serviceIds, socketKeys } from 'src/constants';
import { Room } from 'src/db/entities';
import { JwtGuard } from 'src/guards/jwt.gruard';
import { MessageService } from 'src/message/message.service';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({})
export class SocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    private readonly jwtService: JwtService,
    @Inject(serviceIds.chatService) private readonly chatService: ChatService,
    @Inject(serviceIds.userService) private readonly userService: UsersService,
    @Inject(serviceIds.msgService) private readonly msgService: MessageService,
  ) {}

  @WebSocketServer()
  server: Server;

  // onModuleInit() {
  //   this.server.on(socketKeys.connection, (socket) => {
  //     console.log(socket.id);
  //     console.log('connected');
  //   });
  // }
  afterInit(server: any) {
    console.log('init');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const token = client.handshake.query.token;
      const decoded = this.jwtService.verify(token as string);
      client['user'] = decoded;
      client.data.user = decoded;
      console.log(`Client connected: ${client.id}`);
    } catch (err) {
      console.log('Unauthorized client connection');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(socketKeys.newMessage)
  async onNewMessage(
    @MessageBody() body: { chatName: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(body);
    try {
      const savedMsg = await this.msgService.createMessage(
        body.message,
        client.data.user.id,
        body.chatName,
      );
      // this.server.emit(socketKeys.storedMsg, savedMsg);
      this.server.to(body.chatName).emit(socketKeys.storedMsg, savedMsg);
    } catch (error) {
      client.emit(socketKeys.error, error);
    }
  }

  @SubscribeMessage(socketKeys.createRoomPb)
  async onCreatingNewPbRoom(
    @MessageBody() body: { chatName: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(body);
    try {
      const room = await this.chatService.createPublicRoom(
        body.chatName,
        client.data.user.id,
      );
      // client.emit(socketKeys.roomCreated, room);
      this.server.emit(socketKeys.roomCreated, room);
    } catch (error) {
      this.server.emit(socketKeys.error, error);
      // client.emit(socketKeys.error, error);
    }
    // const clientId = client.id
  }

  @SubscribeMessage(socketKeys.createRoomPr)
  async onCreatingNewPrRoom(
    @MessageBody() data: { chatName: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const room = await this.chatService.createPrivateRoom(
        data.chatName,
        client.data.user.id,
      );
      client.emit(socketKeys.roomCreated, room);
      this.server.emit(socketKeys.roomCreated, room);
    } catch (error) {
      this.server.emit(socketKeys.error, error);
      client.emit(socketKeys.error, error);
    }
  }

  @SubscribeMessage(socketKeys.joinRoom)
  async onUserJoinRoom(
    @MessageBody() body: { name: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const room = await this.chatService.addUserToRoom(
        [client.data.user.id],
        body.name,
      );
      if (room) {
        client.join(room.username);
        this.server.emit(socketKeys.joinedRoom, room.username);
        client.emit(socketKeys.joinedRoom, room.username);
        if (room.roomType == Room.private) {
          const roomUsers = (
            await this.chatService.getChatByNameWithUsers(room.username)
          ).users;
          this.server.to(room.username).emit(socketKeys.roomUsers, roomUsers);
        }
      } else {
        client.emit(socketKeys.error, 'Room not Found!!');
        this.server.emit(socketKeys.error, 'Room not Found!!');
      }
    } catch (error) {
      client.emit(socketKeys.error, error);
    }
  }

  @SubscribeMessage(socketKeys.leaveRoom)
  async onUserLeaveRoom(
    @MessageBody() body: { name: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const room = await this.chatService.removeUserFromRoom(
        [client.data.user.id],
        body.name,
      );
      if (room) {
        client.leave(body.name);
        client.emit(socketKeys.leftRoom, body.name);
        if (room.roomType == Room.private) {
          const roomUsers = (
            await this.chatService.getChatByNameWithUsers(room.username)
          ).users;
          this.server.to(body.name).emit(socketKeys.roomUsers, roomUsers);
        }
      } else {
        client.emit(socketKeys.error, 'Room not Found!!');
      }
    } catch (error) {
      client.emit(socketKeys.error, error);
    }
  }

  @SubscribeMessage(socketKeys.getUserInRoom)
  async handleGetUsersInRoom(
    @MessageBody() data: { chatName: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const room = await this.chatService.getChatByNameWithUsers(data.chatName);
      if (room.roomType == Room.private) {
        const users = room.users.map(({ email, id, createdAt, updatedAt }) => ({
          email,
          id,
          createdAt,
          updatedAt,
        }));
        client.emit(socketKeys.roomUsers, users);
        this.server.emit(socketKeys.roomUsers, users);
      } else {
        client.emit(socketKeys.error, 'Room  Not Found or Is not Private');
        this.server.emit(socketKeys.error, 'Room  Not Found or Is not Private');
      }
    } catch (error) {
      client.emit(socketKeys.error, error);
    }
  }
}
