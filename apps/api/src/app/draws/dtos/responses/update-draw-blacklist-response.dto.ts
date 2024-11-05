import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateDrawBlacklistResponseDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'cm34nfhth00012h5heermrqiu',
    description: 'The ID of the draw',
  })
  readonly drawId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'michael-scott',
    description: 'The ID of the user',
  })
  readonly userId: string;

  @IsString({
    each: true,
  })
  @ApiProperty({
    example: ['jan-levinson', 'toby-flenderson'],
    description: 'The list of blacklisted users',
  })
  readonly blacklistUserIds: string[];

  constructor(drawId: string, userId: string, blacklistUserIds: string[]) {
    this.drawId = drawId;
    this.userId = userId;
    this.blacklistUserIds = blacklistUserIds;
  }
}
