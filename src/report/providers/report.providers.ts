import { DataSource } from 'typeorm';
import { Project } from 'src/entities/project.entity';
export const ReportProviders = [
  {
    provide: 'PROJECT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Project),
    inject: ['DATA_SOURCE'],
  },
];
