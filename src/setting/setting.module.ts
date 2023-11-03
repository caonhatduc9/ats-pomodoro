import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { SettingProvider } from './providers/setting.providers';
import { DatabaseModule } from 'src/database/database.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [DatabaseModule, SharedModule],
  controllers: [SettingController],
  providers: [SettingService, ...SettingProvider],
  exports: [SettingService],
})
export class SettingModule {}
