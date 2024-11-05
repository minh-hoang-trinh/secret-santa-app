import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { DrawsModule } from './draws/draws.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'web'),
    }),
    ConfigModule.forRoot(),
    AuthModule,
    DatabaseModule,
    DrawsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
