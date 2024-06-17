import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { serviceIds } from 'src/constants';
import { MessageService } from './message.service';
import { JwtGuard } from 'src/guards/jwt.gruard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Messages')
@UseGuards(JwtGuard)
@Controller('messages')
export class MessageController {
  constructor(
    @Inject(serviceIds.msgService) private readonly msgService: MessageService,
  ) {}

  @ApiOperation({ summary: 'get message' })
  @ApiResponse({ status: 200, description: 'returns a message' })
  @Get(':id')
  async getMessage(@Param('id') id: number) {
    try {
      const msg = await this.msgService.getOneMessage(id);
      return msg;
    } catch (error) {
      return error;
    }
  }

  @ApiOperation({ summary: 'update message' })
  @ApiResponse({ status: 200, description: 'returns a message' })
  @Put(':id')
  async updateMessage(@Param('id') id: number, @Body() body: any) {
    try {
      const updatedMsg = await this.updateMessage(id, body);
      return updatedMsg;
    } catch (error) {
      return error;
    }
  }

  @ApiOperation({ summary: 'get all message' })
  @ApiResponse({ status: 200, description: 'returns all message' })
  @Get('all')
  async getAllMessage(@Query() query: any) {
    try {
      const msgs = await this.getAllMessage(query);
      return msgs;
    } catch (error) {
      return error;
    }
  }
}
