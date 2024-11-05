import { Injectable } from '@nestjs/common';
import { ExistingDrawDto } from './dtos/common/draw.dto';
import { PrismaService } from '../../database/prisma/prisma.service';
import { DrawResultsDto } from './dtos/common/draw-result.dto';
import { DrawCombinationFinderService } from './draw-combination-finder.service';

@Injectable()
export class DrawsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly drawCombinationFinderService: DrawCombinationFinderService
  ) {}

  async findById(drawId: string): Promise<ExistingDrawDto | null> {
    const draw = await this.prisma.draw.findUnique({
      where: { id: drawId },
      include: { participants: true, blacklists: true },
    });

    if (!draw) {
      return null;
    }

    return new ExistingDrawDto(
      draw.id,
      draw.name,
      draw.ownerId,
      draw.status,
      draw.participants.map((participant) => participant.userId)
    );
  }

  async list(params?: { skip?: number; take?: number }): Promise<{
    skip: number;
    take: number;
    total: number;
    draws: ExistingDrawDto[];
  }> {
    const { skip = 0, take = 5 } = params ?? {};

    const [total, draws] = await Promise.all([
      this.prisma.draw.count(),
      this.prisma.draw.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { participants: true, blacklists: true },
      }),
    ]);

    return {
      skip,
      take,
      total,
      draws: draws.map(
        (draw) =>
          new ExistingDrawDto(
            draw.id,
            draw.name,
            draw.ownerId,
            draw.status,
            draw.participants.map((participant) => participant.userId)
          )
      ),
    };
  }

  async create(params: {
    name: string;
    ownerId: string;
  }): Promise<{ id: string }> {
    const { name, ownerId } = params;

    const draw = await this.prisma.draw.create({
      data: {
        name,
        ownerId,
      },
    });

    await this.prisma.userDraw.create({
      data: {
        drawId: draw.id,
        userId: ownerId,
      },
    });

    return { id: draw.id };
  }

  async addParticipant(params: {
    drawId: string;
    userId: string;
    comment?: string;
  }) {
    const { drawId, userId, comment } = params;

    await this.prisma.userDraw.create({
      data: {
        drawId,
        userId,
        comment,
      },
    });

    return {
      drawId,
      userId,
      comment,
    };
  }

  async updateParticipantBlacklist(params: {
    drawId: string;
    userId: string;
    blacklistUserIds: string[];
  }): Promise<void> {
    const { drawId, userId, blacklistUserIds } = params;

    await this.prisma.blacklist.deleteMany({
      where: {
        drawId,
        userId: userId,
      },
    });

    await this.prisma.blacklist.createMany({
      data: blacklistUserIds.map((blacklistedUserId) => ({
        drawId,
        userId,
        blacklistedUserId,
      })),
    });
  }

  async getParticipantBlacklist(params: {
    drawId: string;
    userId: string;
  }): Promise<string[]> {
    const { drawId, userId } = params;

    const blacklists = await this.prisma.blacklist.findMany({
      where: {
        drawId,
        userId,
      },
    });

    return blacklists.map(({ blacklistedUserId }) => blacklistedUserId);
  }
  async getDrawResults(drawId: string): Promise<DrawResultsDto> {
    const draw = await this.prisma.draw.findUnique({
      where: { id: drawId },
      include: { participants: true },
    });

    if (!draw) {
      throw new Error('Draw not found');
    }

    if (draw.status === 'OPEN') {
      throw new Error('Draw not completed');
    }

    const userDraws = await this.prisma.userDraw.findMany({
      where: { drawId },
    });

    return draw.participants.map((participant) => {
      const sender = participant.userId;
      const receiver = participant.receiverId;
      const commentFromReceiver =
        userDraws.find(
          (userDraw) =>
            userDraw.userId === participant.userId &&
            userDraw.receiverId === participant.receiverId
        )?.comment ?? null;

      if (!receiver) {
        throw new Error('Receiver not found');
      }

      return {
        sender,
        receiver,
        commentFromReceiver,
      };
    });
  }

  async start(drawId: string) {
    const draw = await this.prisma.draw.findUnique({
      where: { id: drawId },
      include: { participants: true, blacklists: true },
    });

    if (!draw) {
      throw new Error('Draw not found');
    }

    if (draw.status === 'COMPLETED') {
      throw new Error('Draw already completed');
    }

    const combination =
      this.drawCombinationFinderService.findPossibleCombination(
        draw.participants.map((participant) => ({
          userId: participant.userId,
          blacklist: draw.blacklists
            .filter(({ userId }) => userId === participant.userId)
            .map(({ blacklistedUserId }) => blacklistedUserId),
        }))
      );

    await Promise.all(
      combination.map(({ userId, receiverId }) =>
        this.prisma.userDraw.update({
          where: {
            userId_drawId: {
              drawId,
              userId,
            },
          },
          data: { receiverId },
        })
      )
    );

    await this.prisma.draw.update({
      where: { id: drawId },
      data: { status: 'COMPLETED' },
    });

    return {
      drawId,
      status: 'COMPLETED' as const,
    };
  }
}
