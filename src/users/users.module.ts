import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { serviceIds } from 'src/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/jwt/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.SECRET ?? 'secret',
      signOptions: { expiresIn: '60min' },
    }),
  ],

  controllers: [UsersController],
  providers: [
    {
      useClass: UsersService,
      provide: serviceIds.userService,
    },
    JwtStrategy,
  ],
  exports: [serviceIds.userService],
})
export class UsersModule {}
