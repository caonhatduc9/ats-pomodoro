import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { SharedModule } from 'src/shared/shared.module';
import { MailingModule } from 'src/v1/mailing/mailing.module';

@Module({
  imports: [SharedModule, MailingModule],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule { }
