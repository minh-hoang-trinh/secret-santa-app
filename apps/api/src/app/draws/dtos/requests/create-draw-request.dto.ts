import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDrawRequestDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Secret Santa 2021',
    description: 'The name of the draw',
  })
  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }
}
