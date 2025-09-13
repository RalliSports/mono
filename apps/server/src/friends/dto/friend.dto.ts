import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/dto/user-response.dto';

export class Friend {
  @ApiProperty({ description: 'Unique ID of the follow relationship' })
  id: string;

  @ApiProperty({ description: 'ID of the user who is following' })
  followerId: string;

  @ApiProperty({ description: 'ID of the user being followed' })
  followingId: string;

  @ApiProperty({ description: 'User who follows' })
  follower: User;

  @ApiProperty({ description: 'User who is being followed' })
  following: User;

  @ApiProperty()
  createdAt: Date;
}
