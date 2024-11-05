import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { DrawResultDto, DrawResultsDto } from '../common/draw-result.dto';
import { Type } from 'class-transformer';

export class GetDrawResultsResponseDto {
  @IsArray()
  @Type(() => DrawResultDto)
  @ApiProperty({
    description: 'The list of results',
    isArray: true,
    type: () => DrawResultDto,
  })
  readonly results: DrawResultsDto;

  constructor(results: DrawResultsDto) {
    this.results = results;
  }
}
