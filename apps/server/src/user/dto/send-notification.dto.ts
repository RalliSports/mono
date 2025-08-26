import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class SendNotificationDto {
  @ApiProperty({
    description: 'Subscription ID (optional for send-notification-all)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  subscriptionId?: string;

  @ApiProperty({
    description: 'Notification title',
    example: 'Game Update',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Notification body',
    example: 'Your game has been updated!',
  })
  @IsString()
  body: string;

  @ApiProperty({
    description: 'URL to open when notification is clicked',
    example: 'https://www.ralli.bet/game/123',
  })
  @IsOptional()
  @IsString()
  url?: string;
}
