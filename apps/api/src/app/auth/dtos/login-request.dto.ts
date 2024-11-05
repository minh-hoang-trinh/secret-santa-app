import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class LoginRequestDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'michael-scott',
    description: 'The username of the user',
  })
  readonly username: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'password',
    description: 'The password of the user',
  })
  readonly password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}
