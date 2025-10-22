import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

// Create the class that must exactly match the type
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
    description: 'User avatar URL (absolute or relative)',
    example: '/images/avatar.png',
  })
  @IsOptional()
  @IsString({ message: 'Avatar must be a valid URL or relative path' })
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
