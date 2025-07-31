import { ApiProperty } from '@nestjs/swagger';
import { ReferralStatus } from '../enum/referral';

export class Referral {
  @ApiProperty({ example: 'fb7f8e32-8365-4a17-8c9a-2c9ad111d35b' })
  id: string;

  @ApiProperty({ example: 'fb7f8e32-8365-4a17-8c9a-2c9ad111d35b' })
  refereeId: string;

  @ApiProperty({ example: 'REF123XYZ' })
  referrerCode: string;

  @ApiProperty({ example: 'pending', enum: ReferralStatus })
  status: string;
}

export class ReferralCode {
  @ApiProperty({ example: 'fb7f8e32-8365-4a17-8c9a-2c9ad111d35b' })
  id: string;

  @ApiProperty({ example: 'fb7f8e32-8365-4a17-8c9a-2c9ad111d35b' })
  userId: string;

  @ApiProperty({ example: 'REF123XYZ' })
  code: string;
}
