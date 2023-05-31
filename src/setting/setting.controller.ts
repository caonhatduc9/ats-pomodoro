import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { SettingService } from './setting.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { JwtAuthGuard } from 'src/v1/auth/guards/auth.jwt.guard';

@Controller('v1')
export class SettingController {
  constructor(private readonly settingService: SettingService) { }

  @UseGuards(JwtAuthGuard)
  @Get('getSettingByUserId')
  getByUserId(@Req() req: any) {
    // return req.user;
    return this.settingService.findByUserId(req.user.userId);
  }
}
