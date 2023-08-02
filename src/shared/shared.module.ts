import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { SharedController } from './shared.controller';
import { SharedProviders } from './provider/shared.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [SharedController],
  providers: [SharedService, ...SharedProviders],
  exports: [SharedService, ...SharedProviders],
})
export class SharedModule { }
