import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class DrawOwnerGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const {
      user: { sub: userId },
      params: { drawId },
    } = req;

    if (userId === 'admin') {
      return true;
    }

    const draw = await this.prismaService.draw.findUnique({
      where: { id: drawId, ownerId: userId },
    });

    return !!draw;
  }
}
