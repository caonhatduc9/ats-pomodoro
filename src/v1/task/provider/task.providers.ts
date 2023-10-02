import { DataSource } from 'typeorm';
import { Category } from 'src/entities/category.entity';

export const TaskProvider = [
  {
    provide: 'CATEGORY_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Category),
    inject: ['DATA_SOURCE'],
  },
];
