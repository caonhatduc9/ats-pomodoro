import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './v1/user/user.module';
import { AuthModule } from './v1/auth/auth.module';
import { MailingModule } from './v1/mailing/mailing.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CorsInterceptor } from './cors.interceptor';
import { SettingModule } from './setting/setting.module';
import { ReportModule } from './report/report.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './v1/task/task.module';
import { PaymentModule } from './v2/payment/payment.module';
import { SharedModule } from './shared/shared.module';

@Module({
  //fix error cors when frontend fetch API
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    DatabaseModule,
    UserModule,
    AuthModule,
    MailingModule,
    SettingModule,
    ReportModule,
    ProjectModule,
    TaskModule,
    PaymentModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CorsInterceptor,
    },
  ],
})
export class AppModule {}
