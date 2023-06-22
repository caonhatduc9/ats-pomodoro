import { DataSource } from 'typeorm';
import { Project } from './../../entities/project.entity';
import { Task } from './../../entities/task.entity';

export const ProjectProvider = [
  {
    provide: 'PROJECT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Project),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'TASK_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Task),
    inject: ['DATA_SOURCE'],
  },
];