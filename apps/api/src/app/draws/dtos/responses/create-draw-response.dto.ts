import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDrawResponseDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'cm34nfhth00012h5heermrqiu',
    description: 'The ID of the created draw',
  })
  readonly id: string;

  constructor(id: string) {
    this.id = id;
  }
}
