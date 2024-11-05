import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ParticipateDrawRequestDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'I want a PS5',
    description: 'A comment for the secret santa',
  })
  readonly comment: string | undefined;
}
