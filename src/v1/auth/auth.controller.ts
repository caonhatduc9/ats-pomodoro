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
  HttpStatus,
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
  async googleAuth(@Request() req) {
    return HttpStatus.OK;
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Request() req) {
    return this.authService.googleLogin(req);
  }

  @Get('apple')
  @UseGuards(AuthGuard('apple'))
  async appleAuth(@Request() req): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('apple/redirect')
  @UseGuards(AuthGuard('apple'))
  appleAuthRedirect(@Request() req: any): any {
    return this.authService.appleLogin(req);
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

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth(@Request() req) {
    return HttpStatus.OK;
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  githubAuthRedirect(@Request() req) {
    return this.authService.githubLogin(req);
  }
}
