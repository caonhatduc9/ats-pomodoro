import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { JwtAuthGuard } from 'src/v1/auth/guards/auth.jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('v1')
export class ReportController {
  constructor(private readonly reportService: ReportService) { }


  @Get('getSummaryReport')
  getSummaryReport(@Req() req: any) {
    return this.reportService.getSummaryReportByUserId(+req.user.userId);
  }


}
