import { Inject, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from '../entities/project.entity';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectService {
  constructor(@Inject('PROJECT_REPOSITORY') private projectRepository: Repository<Project>,
    @Inject('TASK_REPOSITORY') private taskRepository: Repository<Task>
  ) { }

  async createTask(createProjectDto: CreateProjectDto, projectId: number, project: boolean) {
    if (await this.projectRepository.findOne({ where: { projectId } })) {
      if (project == false) {
        return this.taskRepository.save(createProjectDto);
      }
      
      return {
        statusCode: 200,
        message: "create success"
      };
    }
  }

  // findAll() {
  //   return `This action returns all project`;
  // }

}
