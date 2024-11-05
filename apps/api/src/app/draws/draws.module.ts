import { Module } from '@nestjs/common';
import { DrawsController } from './draws.controller';
import { DrawsService } from './draws.service';
import { DatabaseModule } from '../../database/database.module';
import { DrawCombinationFinderService } from './draw-combination-finder.service';

@Module({
  imports: [DatabaseModule],
  controllers: [DrawsController],
  providers: [DrawsService, DrawCombinationFinderService],
})
export class DrawsModule {}
