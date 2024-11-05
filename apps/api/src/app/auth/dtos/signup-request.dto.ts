import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class SignupRequestDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'michael-scott',
    description: 'The username of the user to sign up',
  })
  readonly username: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'password',
    description: 'The password of the user to sign up',
  })
  readonly password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}
