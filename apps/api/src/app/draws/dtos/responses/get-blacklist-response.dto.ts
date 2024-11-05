import { ApiProperty } from '@nestjs/swagger';

export class GetBlacklistResponseDto {
  @ApiProperty({
    example: ['jan-levinson', 'toby-flenderson'],
    description: 'The list of blacklisted users',
  })
  readonly blacklist: string[];

  constructor(blacklist: string[]) {
    this.blacklist = blacklist;
  }
}
