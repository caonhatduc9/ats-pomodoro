import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('product', { schema: 'ats_pomodoro' })
export class Product {
  @PrimaryColumn({ type: 'varchar', name: 'productId', length: 200 })
  productId: number;
  @Column('varchar', { name: 'productName', length: 50 })
  productName: string;
}
