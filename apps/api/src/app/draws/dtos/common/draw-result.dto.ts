import { ApiProperty } from '@nestjs/swagger';

export class DrawResultDto {
  @ApiProperty({
    description: 'The sender of the gift',
    example: 'jim-halpert',
  })
  readonly sender: string;

  @ApiProperty({
    description: 'The receiver of the gift',
    example: 'dwight-schrute',
  })
  readonly receiver: string;

  @ApiProperty({
    description: 'The comment from the receiver',
    example: 'I want a beet',
  })
  readonly commentFromReceiver: string | null;

  constructor(
    sender: string,
    receiver: string,
    commentFromReceiver: string | null
  ) {
    this.sender = sender;
    this.receiver = receiver;
    this.commentFromReceiver = commentFromReceiver;
  }
}

export type DrawResultsDto = DrawResultDto[];
