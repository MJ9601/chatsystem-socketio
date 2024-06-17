import { Body, Controller, Inject, Post, Put } from '@nestjs/common';
import { serviceIds } from 'src/constants';
import { CreateAndLoginDto } from 'src/dtos/user.dtos';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth and Users')
@Controller('users')
export class UsersController {
  constructor(
    @Inject(serviceIds.userService) private readonly userService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Post api for login' })
  @ApiResponse({ status: 201, description: 'token' })
  @Post('login')
  async loginHandler(@Body() input: CreateAndLoginDto) {
    try {
      const token = await this.userService.loginUser(input);
      return { token };
    } catch (error) {
      return error;
    }
  }

  @Put('logout')
  async logoutHandler() {}

  @ApiOperation({ summary: 'Post api for signup' })
  @ApiResponse({ status: 201, description: 'successFul response' })
  @Post('signup')
  async signupHandler(@Body() input: CreateAndLoginDto) {
    try {
      const newUser = await this.userService.createNewUser(input);
      return newUser;
    } catch (error) {
      return error;
    }
  }
}
