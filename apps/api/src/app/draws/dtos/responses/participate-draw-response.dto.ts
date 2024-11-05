import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ParticipateDrawResponseDto {
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
    example: 'cm34nfhth00012h5heermrqiu',
    description: 'The ID of the user',
  })
  readonly userId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'I want a PS5',
    description: 'A comment for the secret santa',
  })
  readonly comment: string | undefined;

  constructor(drawId: string, userId: string, comment?: string) {
    this.drawId = drawId;
    this.userId = userId;
    this.comment = comment;
  }
}
