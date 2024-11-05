import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDrawBlacklistRequestDto {
  @IsOptional()
  @IsString({
    each: true,
  })
  @ApiProperty({
    example: ['user1', 'user2'],
    description: 'The list of user ids to blacklist',
  })
  readonly blacklistUserIds: string[];

  constructor(blacklistUserIds: string[]) {
    this.blacklistUserIds = blacklistUserIds;
  }
}
