import { ApiProperty } from '@nestjs/swagger';

export class ExistingDrawDto {
  @ApiProperty({
    description: "The draw's ID",
  })
  readonly id: string;
  @ApiProperty({
    description: "The draw's name",
  })
  readonly name: string;
  @ApiProperty({
    description: 'The username of the draw owner',
  })
  readonly ownerId: string;
  @ApiProperty({
    description: 'The list of participants',
  })
  readonly participants: string[];

  @ApiProperty({
    description: 'The draw status',
    enum: ['OPEN', 'COMPLETED'],
  })
  readonly status: 'OPEN' | 'COMPLETED';

  constructor(
    id: string,
    name: string,
    ownerId: string,
    status: 'OPEN' | 'COMPLETED',
    participants: string[]
  ) {
    this.id = id;
    this.name = name;
    this.ownerId = ownerId;
    this.status = status;
    this.participants = participants;
  }
}
