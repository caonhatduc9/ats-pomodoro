import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
// import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/auth.local.guard';
import { JwtAuthGuard } from './guards/auth.jwt.guard';
import { UserSignupDto } from './dto/auth.signup.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoginValidationPipe } from './pipes/login.validate.pipe';
import { ChangePassDto } from './dto/changePass.dto';
import { log } from 'console';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }
  @Post('signup')
  async signup(@Body() UserSignupDto: UserSignupDto): Promise<any> {
    return this.authService.signup(UserSignupDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Request() req) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Request() req) {
    return this.authService.googleLogin(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Patch('changePass')
  changePassword(@Body() changePassDto: ChangePassDto): Promise<any> {
    return this.authService.changePassword(changePassDto);
  }

  @Post('forgotPass')
  forgotPassword(@Body('email') email: string): Promise<any> {
    return this.authService.forgotPassword(email);
  }
}
