import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ReportProviders } from './providers/report.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [ReportController],
  providers: [ReportService, ...ReportProviders],
})
export class ReportModule { }
