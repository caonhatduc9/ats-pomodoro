import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { ProjectModule } from 'src/project/project.module';
import { TaskProvider } from './provider/task.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [ProjectModule, DatabaseModule],
  controllers: [TaskController],
  providers: [TaskService, ...TaskProvider],
})
export class TaskModule {}
