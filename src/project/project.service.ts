import { Inject, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from '../entities/project.entity';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';
import { CreateProjectTaskDto } from './dto/createTask.dto';
// import { CreateTaskDto } from './dto/createTask.dto';

@Injectable()
export class ProjectService {
  constructor(@Inject('PROJECT_REPOSITORY') private projectRepository: Repository<Project>,
    @Inject('TASK_REPOSITORY') private taskRepository: Repository<Task>
  ) { }

  async createTask(userId: number, createProjectTaskDto: CreateProjectTaskDto, project: string) {
    if (project === 'true') {
      const foundProject = await this.projectRepository.findOne({ where: { projectId: createProjectTaskDto.project.projectId } });
      if (foundProject) {
        const newTask = this.taskRepository.create(
          {
            projectId: foundProject.projectId,
            userId: foundProject.userId,
            taskName: createProjectTaskDto.task.taskName,
            estimatePomodoro: createProjectTaskDto.task.estimatePomodoro,
            note: createProjectTaskDto.task.note,
            createdDate: new Date().toISOString().slice(0, 10),
          })
        const savedTask = await this.taskRepository.save(newTask);
        return savedTask;
        // return {
        //   "statusCode": 200,
        //   "message": "create success"
        // }
      }
      else {
        const newProject = this.projectRepository.create({
          userId: userId,
          projectName: createProjectTaskDto.project.projectName,
          createdDate: new Date().toISOString().slice(0, 10),
        })
        const savedProject = await this.projectRepository.save(newProject);
        const newTask = this.taskRepository.create(
          {
            projectId: savedProject.projectId,
            userId: userId,
            taskName: createProjectTaskDto.task.taskName,
            estimatePomodoro: createProjectTaskDto.task.estimatePomodoro,
            note: createProjectTaskDto.task.note,
            createdDate: new Date().toISOString().slice(0, 10),
          })
        const savedTask = await this.taskRepository.save(newTask);
        return savedTask;//chỗ này return ra để xem test thôi chứ khi deloy thi return như ở dưới
        // return {
        //   "statusCode": 200,
        //   "message": "create success"
        // }
      }
    }
    else {
      //day la trương hợp dễ hơ chỉ dùng table task thôi không cần project
      //implement here
      const newTask = this.taskRepository.create(
        {
          taskName: createProjectTaskDto.task.taskName,
          estimatePomodoro: createProjectTaskDto.task.estimatePomodoro,
          note: createProjectTaskDto.task.note,
          createdDate: new Date().toISOString().slice(0, 10),
        })
      const savedTask = await this.taskRepository.save(newTask);
      return savedTask;
      // return {
      //   statusCode: 200,
      //   message: "create success"
      // };
    }
  }

  async findByUserId(id: number) {
    const data = await this.projectRepository.createQueryBuilder('project')
      .leftJoinAndSelect('', '')
      
      .where('user.userId = :id', { id })
      .getOne();

    const listTask = await this.taskRepository.createQueryBuilder('task')
    //   .select(['asset.assetId', 'asset.assetName', 'asset.author', 'asset.type', 'asset.assetUrl', 'asset.isFree'])
    //   .getMany();

    return {
      status: 'success',
      // data: cleanedData ? cleanedData : {},
    }
  }
}




