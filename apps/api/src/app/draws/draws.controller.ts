import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CreateDrawRequestDto } from './dtos/requests/create-draw-request.dto';
import { DrawsService } from './draws.service';
import { AuthGuard } from '../auth/auth.guard';
import { UserContext } from '../auth/auth.service';
import { DrawOwnerGuard } from './draw-owner.guard';
import { ParticipateDrawRequestDto } from './dtos/requests/participate-draw-request.dto';
import { UpdateDrawBlacklistRequestDto } from './dtos/requests/update-draw-blacklist-request.dto';
import { ListDrawResponseDto } from './dtos/responses/list-draw-response.dto';
import { GetDrawResponseDto } from './dtos/responses/get-draw-response.dto';
import { CreateDrawResponseDto } from './dtos/responses/create-draw-response.dto';
import { GetBlacklistResponseDto } from './dtos/responses/get-blacklist-response.dto';
import { GetDrawResultsResponseDto } from './dtos/responses/get-draw-results-response.dto';
import { ParticipateDrawResponseDto } from './dtos/responses/participate-draw-response.dto';
import { UpdateDrawBlacklistResponseDto } from './dtos/responses/update-draw-blacklist-response.dto';
import { StartDrawResponseDto } from './dtos/responses/start-draw-response.dto';

@Controller('draws')
@ApiTags('draws')
@ApiSecurity('bearer')
export class DrawsController {
  constructor(private readonly drawsService: DrawsService) {}

  @Get(':drawId')
  @ApiOperation({ summary: 'Get a draw by id' })
  @ApiResponse({
    status: 200,
    type: () => GetDrawResponseDto,
  })
  @UseGuards(AuthGuard)
  async get(@Param('drawId') drawId: string): Promise<GetDrawResponseDto> {
    const draw = await this.drawsService.findById(drawId);

    if (!draw) {
      throw new NotFoundException();
    }
    return draw;
  }

  @Get()
  @ApiOperation({ summary: 'List draws with pagination' })
  @ApiResponse({
    status: 200,
    type: () => ListDrawResponseDto,
  })
  @UseGuards(AuthGuard)
  async list(
    @Query('skip') skip = 0,
    @Query('take') take = 5
  ): Promise<ListDrawResponseDto> {
    return this.drawsService.list({ skip, take });
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new draw' })
  @ApiResponse({
    status: 201,
    type: () => CreateDrawResponseDto,
  })
  @UseGuards(AuthGuard)
  async create(
    @Body() body: CreateDrawRequestDto,
    @Request() { user: { sub: userId } }: { user: UserContext }
  ): Promise<CreateDrawResponseDto> {
    const { name } = body;

    return this.drawsService.create({
      name,
      ownerId: userId,
    });
  }

  @Post(':drawId/participate')
  @HttpCode(200)
  @ApiOperation({ summary: 'Participate in a draw' })
  @ApiResponse({
    status: 200,
    type: () => ParticipateDrawResponseDto,
  })
  @UseGuards(AuthGuard)
  async participate(
    @Param('drawId') drawId: string,
    @Body() body: ParticipateDrawRequestDto,
    @Request() { user: { sub: userId } }: { user: UserContext }
  ): Promise<ParticipateDrawResponseDto> {
    const { comment } = body;

    return this.drawsService.addParticipant({
      drawId,
      userId,
      comment,
    });
  }

  @Put(':drawId/blacklist')
  @HttpCode(200)
  @ApiOperation({
    summary: `Update the current user's blacklist for a draw`,
    description:
      'The blacklist is a list of user ids that the current user does not want to give a gift to.',
  })
  @ApiResponse({
    status: 200,
    type: () => UpdateDrawBlacklistResponseDto,
  })
  @UseGuards(AuthGuard)
  async blacklist(
    @Param('drawId') drawId: string,
    @Body() body: UpdateDrawBlacklistRequestDto,
    @Request() { user: { sub: userId } }: { user: UserContext }
  ): Promise<UpdateDrawBlacklistResponseDto> {
    const { blacklistUserIds } = body;

    await this.drawsService.updateParticipantBlacklist({
      drawId,
      userId,
      blacklistUserIds: blacklistUserIds,
    });

    return {
      drawId,
      userId,
      blacklistUserIds,
    };
  }

  @Get(':drawId/blacklist')
  @ApiOperation({
    summary: `Get the current connected user's blacklist for a draw`,
  })
  @ApiAcceptedResponse({
    type: () => GetBlacklistResponseDto,
  })
  @UseGuards(AuthGuard)
  async getBlacklist(
    @Param('drawId') drawId: string,
    @Request() { user: { sub } }: { user: UserContext }
  ): Promise<GetBlacklistResponseDto> {
    const blacklist = await this.drawsService.getParticipantBlacklist({
      drawId,
      userId: sub,
    });

    return new GetBlacklistResponseDto(blacklist);
  }

  @Post(':drawId/start')
  @HttpCode(200)
  @ApiOperation({ summary: 'Start a draw' })
  @ApiResponse({
    status: 200,
    type: () => StartDrawResponseDto,
  })
  @UseGuards(AuthGuard, DrawOwnerGuard)
  async start(@Param('drawId') drawId: string): Promise<StartDrawResponseDto> {
    return this.drawsService.start(drawId);
  }

  @Get(':drawId/results')
  @HttpCode(200)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Get the draw results' })
  @ApiResponse({
    status: 200,
    type: () => GetDrawResultsResponseDto,
  })
  @UseGuards(AuthGuard, DrawOwnerGuard)
  async getResults(
    @Param('drawId') drawId: string
  ): Promise<GetDrawResultsResponseDto> {
    const results = await this.drawsService.getDrawResults(drawId);

    return new GetDrawResultsResponseDto(results);
  }
}
