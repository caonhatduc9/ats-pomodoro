import { Column, Entity } from 'typeorm';

@Entity('stripeEvent', { schema: 'ats_pomodoro' })
export class StripeEvent {
  @Column('varchar', { primary: true, name: 'eventId', length: 100 })
  eventId: string;
}
