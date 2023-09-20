import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { SharedModule } from 'src/shared/shared.module';
import { MailingModule } from 'src/v1/mailing/mailing.module';
import { PaymentProvider } from './providers/payment.providers';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from 'src/v1/user/user.module';

@Module({
  imports: [SharedModule, MailingModule, DatabaseModule, UserModule],
  controllers: [PaymentController],
  providers: [PaymentService, ...PaymentProvider],
})
export class PaymentModule {}
