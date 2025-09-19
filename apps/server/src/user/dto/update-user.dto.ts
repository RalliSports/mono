import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.png',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Avatar must be a valid URL' })
  avatar?: string;

  @ApiProperty({
    description: "Whether this is the user's first login",
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isFirstLogin?: boolean;
}

export class UpdateUserEmailDto {
  @ApiProperty({
    description: 'User email',
    example: 'example@example.com',
  })
  @IsEmail({}, { message: 'Email must be a valid email' })
  email: string;
}
