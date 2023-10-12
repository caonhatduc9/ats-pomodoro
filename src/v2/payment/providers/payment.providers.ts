import { DataSource } from 'typeorm';
import { StripeEvent } from 'src/entities/stripeEvent.entity';
import { Subscription } from 'src/entities/subscription.entity';
import { Product } from 'src/entities/product.entity';
export const PaymentProvider = [
  {
    provide: 'STRIPE_EVENT_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(StripeEvent),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'SUBSCRIPTION_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Subscription),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'PRODUCT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Product),
    inject: ['DATA_SOURCE'],
  },
];
