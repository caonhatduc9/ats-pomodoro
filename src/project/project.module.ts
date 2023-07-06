import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ProjectProvider } from './providers/project.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [ProjectController],
  providers: [ProjectService, ...ProjectProvider],
  exports: [...ProjectProvider],
})
export class ProjectModule {}
