import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

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

  // @ApiProperty()
  // role: Role;
}
