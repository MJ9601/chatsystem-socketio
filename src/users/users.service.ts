import {
  ConflictException,
  Injectable,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities';
import { CreateAndLoginDto } from 'src/dtos/user.dtos';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  public async createNewUser(input: CreateAndLoginDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: input.username },
      });
      if (user) {
        throw new ConflictException('User already Exist!!');
      }
      const hash = await argon2.hash(input.password);

      const newUser = this.userRepository.create({
        email: input.username,
        password: hash,
      });

      const savedUser = await this.userRepository.save(newUser);
      const { password, ...rest } = savedUser;
      return rest;
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }

  public async findUserByEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException('User Not Found!!');
      }
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async getUsers(query?: any) {
    try {
      const users = await this.userRepository.find({
        where: { ...(query && query) },
      });
      return users;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  public async getOneUser(id: number) {
    try {
      const user = await this.userRepository.findBy({ id });
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async loginUser(input: CreateAndLoginDto) {
    try {
      const user = await this.findUserByEmail(input.username);

      const verified = await argon2.verify(user.password, input.password);

      if (!verified) {
        throw new ConflictException('Invalid Email or Password!!');
      }

      const { password, chats, messages, ...rest } = user;

      const token = this.jwtService.signAsync(rest);
      return token;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async validateUser(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
