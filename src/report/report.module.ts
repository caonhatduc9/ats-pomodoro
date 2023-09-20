import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ReportProviders } from './providers/report.providers';
import { UserModule } from 'src/v1/user/user.module';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [ReportController],
  providers: [ReportService, ...ReportProviders],
})
export class ReportModule {}
