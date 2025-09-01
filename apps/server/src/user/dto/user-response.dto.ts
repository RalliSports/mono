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
export class PushSubscriptions {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  subscription: Record<string, any>;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
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

  @ApiProperty()
  @IsOptional()
  hasBeenFaucetedSol?: boolean;

  @ApiProperty()
  @IsOptional()
  pushSubscriptions?: PushSubscriptions;

  // @ApiProperty()
  // role: Role;
}
