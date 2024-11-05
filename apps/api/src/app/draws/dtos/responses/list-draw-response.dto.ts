import { ApiProperty } from '@nestjs/swagger';
import { ExistingDrawDto } from '../common/draw.dto';

export class ListDrawResponseDto {
  @ApiProperty({
    description: 'The total number of draws',
  })
  readonly total: number;
  @ApiProperty({
    description: 'The number of draws skipped',
  })
  readonly skip: number;
  @ApiProperty({
    description: 'The number of draws taken',
  })
  @ApiProperty({
    description: 'The list of draws',
  })
  readonly draws: ExistingDrawDto[];

  constructor(total: number, skip: number, draws: ExistingDrawDto[]) {
    this.total = total;
    this.skip = skip;
    this.draws = draws;
  }
}
