import { Module } from '@nestjs/common';
import { DmsService } from './dms.service';
import { DmsController } from './dms.controller';
import { ConfigService } from '@nestjs/config';
import { AiService } from './ai.service';

@Module({
  controllers: [DmsController],
  providers: [DmsService, ConfigService, AiService],
  exports: [DmsService],
})
export class DmsModule {}
