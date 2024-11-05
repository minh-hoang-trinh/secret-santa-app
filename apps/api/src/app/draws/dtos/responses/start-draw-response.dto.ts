import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class StartDrawResponseDto {
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
    description: 'The draw status',
    enum: ['COMPLETED'],
  })
  readonly status: 'COMPLETED';

  constructor(drawId: string, status: 'COMPLETED') {
    this.drawId = drawId;
    this.status = status;
  }
}
