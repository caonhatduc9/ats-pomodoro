import { UserService } from './../../v1/user/user.service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Console, log } from 'console';
import { StripeEvent } from 'src/entities/stripeEvent.entity';
import { Subscription } from 'src/entities/subscription.entity';
import { SharedService } from 'src/shared/shared.service';
import { MailingService } from 'src/v1/mailing/mailing.service';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  private endpointSecret: string;
  constructor(
    private userService: UserService,
    private readonly sharedService: SharedService,
    private configService: ConfigService,
    @Inject('SUBSCRIPTION_REPOSITORY')
    private subscriptionRepository: Repository<Subscription>,
    @Inject('STRIPE_EVENT_REPOSITORY')
    private stripeEventRepository: Repository<StripeEvent>,
    private maillingService: MailingService,
  ) {
    const secretKey = this.configService.get('STRIPE_SECRET_KEY');
    this.stripe = new Stripe(secretKey, { apiVersion: '2022-11-15' });
    this.endpointSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    console.log('this.endpointSecret', this.endpointSecret);
  }

  createEvent(eventId: string) {
    return this.stripeEventRepository.insert({ eventId });
  }

  async createCheckoutSession(payload: any): Promise<any> {
    console.log('payload', payload);
    const currentSubscription = payload?.currentSubscription ?? null;

    console.log(
      '🚀 ~ file: payment.service.ts:45 ~ PaymentService ~ createCheckoutSession ~ currentSubscription:',
      currentSubscription,
    );

    const { username, email, userId, priceId } = payload;

    console.log(
      '🚀 ~ file: payment.service.ts:46 ~ PaymentService ~ createCheckoutSession ~ { email, userId }:',
      { email, userId },
    );
    try {
      let customer: Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>;
      if (payload && currentSubscription) {
        const foundSubscription = await this.subscriptionRepository.findOne({
          where: { subscriptionId: currentSubscription },
        });

        console.log(
          '🚀 ~ file: payment.service.ts:57 ~ PaymentService ~ createCheckoutSession ~ foundSubscription:',
          foundSubscription,
        );

        const customerId = foundSubscription.customerId;
        console.log('customerId after found 53', customerId);

        if (customerId) {
          customer = await this.stripe.customers.retrieve(customerId);

          console.log(
            '🚀 ~ file: payment.service.ts:74 ~ PaymentService ~ createCheckoutSession ~ customer:',
            customer,
          );
        }
      } else {
        customer = await this.stripe.customers.create({
          name: username,
          email: email,
          metadata: {
            userId: userId,
          },
        });

        console.log(
          '🚀 ~ file: payment.service.ts:79 ~ PaymentService ~ createCheckoutSession ~ customer:',
          customer,
        );
      }
      // return 0;
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        //if want to sub for a specific asset
        // metadata: {
        //   assetId: payload.assetId,
        // },
        mode: 'subscription',
        customer: customer.id,
        success_url: this.configService.get('STRIPE_SUCCESS_URL'),
        cancel_url: this.configService.get('STRIPE_CANCEL_URL'),
      });
      // console.log(session);

      return {
        statusCode: 200,
        data: {
          url: session.url,
        },
      };
    } catch (error) {
      console.error(error);
      //   res.status(500).json({ error: 'An error occurred.' });
      // res.status(500).json({ error: JSON.stringify(error) });
    }
  }

  async getListProduct(): Promise<any> {
    const prices = await this.stripe.prices.list({ active: true });
    return {
      statusCode: 200,
      data: prices.data.reverse(),
    };
  }

  async saveSubscription(customer: any, data: any): Promise<Subscription> {
    const newSub = new Subscription();
    newSub.customerId = customer.id;
    newSub.createdDate = data.createdDate;
    newSub.endDate = data.endDate;
    newSub.assetId = data.assetId;
    newSub.typeSubscription =
      data.typeSubscription === 'month' ? 'monthly' : 'annual';
    newSub.priceId = data.priceId;
    newSub.stripeSubscriptionId = data.subscriptionId;
    newSub.userId = data.userId;
    console.log('newSub', newSub);
    try {
      const savedSub = await this.subscriptionRepository.save(newSub);

      console.log(
        '🚀 ~ file: payment.service.ts:149 ~ PaymentService ~ saveSubscription ~ savedSub:',
        savedSub,
      );

      return savedSub;
    } catch (err) {
      console.log(err);
    }
  }

  public async constructEventFromPayload(signature: string, payload: any) {
    // const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    const webhookSecret = this.endpointSecret;
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
  }
  async handleEvent(event: any): Promise<any> {
    try {
      await this.createEvent(event.id);
    } catch (error) {
      console.log('error', error);
      throw new BadRequestException('This event was already processed');
    }
    let subscriptio;
    let status;
    switch (event.type) {
      case 'checkout.session.completed':
        const dataObject = event.data.object;
        const subscriptionId = dataObject.subscription;

        console.log(
          '🚀 ~ file: payment.service.ts:177 ~ PaymentService ~ handleEvent ~ subscriptionId:',
          subscriptionId,
        );

        console.log(
          '🚀 ~ file: payment.service.ts:176 ~ PaymentService ~ handleEvent ~ dataObject:',
          dataObject,
        );

        const payload: any = {};

        const subscription: any = await this.stripe.subscriptions.retrieve(
          subscriptionId,
        );

        const subscriptionCreatedAt = new Date(subscription.created * 1000);
        const subscriptionExpiresAt = new Date(
          subscription.current_period_end * 1000,
        );

        payload.createdDate = subscriptionCreatedAt
          .toISOString()
          .slice(0, 19)
          .replace('T', ' ');
        payload.endDate = subscriptionExpiresAt
          .toISOString()
          .slice(0, 19)
          .replace('T', ' ');
        payload.assetId = dataObject.metadata.assetId;
        payload.priceId = subscription.plan.id;
        payload.typeSubscription = subscription.plan.interval;
        payload.subscriptionId = dataObject.subscription;

        this.stripe.customers
          .retrieve(event.data.object.customer)
          .then(async (customer) => {
            console.log(
              '🚀 ~ file: payment.service.ts:216 ~ PaymentService ~ .then ~ customer:',
              customer,
            );

            try {
              // CREATE ORDER
              const userId = (customer as Stripe.Customer).metadata?.userId;
              payload.userId = userId;
              console.log(
                '🚀 ~ file: payment.service.ts:224 ~ PaymentService ~ .then ~ userId:',
                userId,
              );

              const savedSub = await this.saveSubscription(customer, payload);

              // const foundUser = await this.userService.findOne(+userId);

              // foundUser.currentSubscriptionId = savedSub.subscriptionId;
              // await this.userService.create(foundUser);

              const updateFields = {
                isPremium: 1,
                // currentSubscriptionId: savedSub.subscriptionId,
              };

              this.userService.updateUserFields(+userId, updateFields);
              const email = dataObject.customer_details.email;
              const subject = 'Pomodoro - Payment Success';
              const content =
                'Payment Success ' +
                `for  ${subscription.plan.interval} Id ${subscriptionId}`;
              this.maillingService.sendMail(email, subject, content);
            } catch (err) {
              console.log(err);
            }
          })
          .catch((err) => console.log(err.message));

        break;
      case 'customer.subscription.deleted':
        const subscriptionDeletedObject = event.data.object;

        console.log(
          '🚀 ~ file: payment.service.ts:286 ~ PaymentService ~ handleEvent ~ subscriptio:',
          subscription,
        );
        const stripeSubscriptionId = subscriptionDeletedObject.id;
        const foundSubscription = await this.subscriptionRepository.delete({
          stripeSubscriptionId,
        });
        console.log("foundSubscription", foundSubscription);
        status = subscriptio.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription update.
        // handleSubscriptionUpdated(subscription);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
      // console.log('==EVENT', event.data.object);
    }
  }
}
