import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class Role {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;
}

export class User {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  emailAddress: string;

  @ApiProperty()
  walletAddress: string;

  @ApiProperty()
  paraUserId: string;

  @ApiProperty()
  @IsOptional()
  firstName?: string;

  @ApiProperty()
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @IsOptional()
  userName?: string;

  @ApiProperty()
  @IsOptional()
  avatar?: string;

  // @ApiProperty()
  // role: Role;
}
