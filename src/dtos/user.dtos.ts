import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAndLoginDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'An Email for signup or signin' })
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @ApiProperty({
    description: 'password with min length of 8 and max length of 32',
  })
  password: string;
}
