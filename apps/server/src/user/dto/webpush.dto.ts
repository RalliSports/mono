import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

class PushSubscriptionKeys {
  @ApiProperty()
  p256dh: string;

  @ApiProperty()
  auth: string;
}

export class PushSubscriptionResponse {
  @ApiProperty()
  endpoint: string;

  @ApiProperty()
  expirationTime: number ;

  @ApiProperty()
  keys: PushSubscriptionKeys;
}

export class UserPushSubscription {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  subscription: PushSubscriptionResponse;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CreateWebpushDto {
  @ApiProperty()
  @IsObject()
  payload: PushSubscriptionResponse;
}
