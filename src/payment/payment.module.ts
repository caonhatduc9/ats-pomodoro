import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports : [SharedModule],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule {}
