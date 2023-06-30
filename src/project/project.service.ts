import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Project, ProjectStatus } from '../entities/project.entity';
import { Task, TaskStatus } from '../entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectService {
  constructor(@Inject('PROJECT_REPOSITORY') private projectRepository: Repository<Project>,
    @Inject('TASK_REPOSITORY') private taskRepository: Repository<Task>
  ) { }


  async createTask(userId: number, body: any, project: string) {
    if (project === 'true') {
      if (body.project.projectId == null) {
        const newProject = this.projectRepository.create({
          userId: userId,
          projectName: body.project.projectName,
          createdDate: new Date().toISOString().slice(0, 10),
        })
        const savedProject = await this.projectRepository.save(newProject);
        const newTask = this.taskRepository.create(
          {
            projectId: savedProject.projectId,
            userId: userId,
            taskName: body.task.taskName,
            estimatePomodoro: body.task.estimatePomodoro,
            note: body.task.note,
            createdDate: new Date().toISOString().slice(0, 10),
          })
        const savedTask = await this.taskRepository.save(newTask);
        return {
          statusCode: 200,
          message: "create success"
        }
      }
      else {
        const foundProject = await this.projectRepository.findOne({ where: { projectId: body.project.projectId } });
        if (foundProject) {
          const newTask = this.taskRepository.create(
            {
              projectId: foundProject.projectId,
              userId: foundProject.userId,
              taskName: body.task.taskName,
              estimatePomodoro: body.task.estimatePomodoro,
              note: body.task.note,
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
            projectName: body.project.projectName,
            createdDate: new Date().toISOString().slice(0, 10),
          })
          const savedProject = await this.projectRepository.save(newProject);
          const newTask = this.taskRepository.create(
            {
              projectId: savedProject.projectId,
              userId: userId,
              taskName: body.task.taskName,
              estimatePomodoro: body.task.estimatePomodoro,
              note: body.task.note,
              createdDate: new Date().toISOString().slice(0, 10),
            })
          const savedTask = await this.taskRepository.save(newTask);
          return savedTask;
          // return {
          //   "statusCode": 200,
          //   "message": "create success"
          // }
        }
      }
    }
    else {
      //day la trương hợp dễ hơ chỉ dùng table task thôi không cần project
      //implement here
      const newTask = this.taskRepository.create(
        {
          userId,
          taskName: body.taskName,
          estimatePomodoro: body.estimatePomodoro,
          note: body.note,
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

  async findTaskByUserId(id: number) {
    const data = await this.taskRepository.createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .where('task.userId = :id', { id })
      // .andWhere('task.status != :status', { status: TaskStatus.DELETE })
      .getMany();

    // return data;

    return {
      statusCode: 200,
      data: data ? data : {},
    }
  }

  async updateTaskByUserId(body: any, userId: number) {
    const foundTask = await this.taskRepository.findOne({ where: { taskId: body.taskId } });
    if (foundTask) {
      if (foundTask.projectId == null) {
        const newTask = this.taskRepository.create({
          // userId: foundTask.userId,
          taskId: body.taskId,
          taskName: body.taskName,
          estimatePomodoro: body.estimatePomodoro,
          note: body.note,
          actualPomodoro: body.actualPomodoro,
          modifiedDate: new Date().toISOString().slice(0, 10),
          status: body.status,
        })
        console.log(body.taskId);
        const savedTask = await this.taskRepository.save(newTask);
        return {
          statusCode: 200,
          message: "update success"
        }
      }
      else {
        const foundProject = await this.projectRepository.findOne({ where: { projectId: body.projectId } });
        if (foundProject) {
          console.log("found project", foundProject);
          const newProject = this.projectRepository.create({
            projectId: body.projectId,
            projectName: body.projectName,
            modifiedDate: new Date().toISOString().slice(0, 10), 
          })
          const updatedProject = await this.projectRepository.save(newProject);
          // return savedProject;
          console.log(updatedProject);
          console.log(body.taskName);
          const newTask = this.taskRepository.create(
            {
              projectId: body.projectId,
              taskId: body.taskId,
              taskName: body.taskName,
              estimatePomodoro: body.estimatePomodoro,
              note: body.note,
              modifiedDate: new Date().toISOString().slice(0, 10),
              status: body.status,
            })
          const savedTask = await this.taskRepository.save(newTask);
          return {
            statusCode: 200,
            message: "update success"
          }
        }
      }
    }
  }
  async deleteTaskByUserId(taskId: number, userId: number) {
    const foundTask = await this.taskRepository.findOne({ where: { taskId: taskId } });
    if (foundTask) {
      const newTask = this.taskRepository.create({
        taskId: taskId,
        status: TaskStatus.DELETE,
        modifiedDate: new Date().toISOString().slice(0, 10),
      })
      const savedTask = await this.taskRepository.save(newTask);
      return {
        statusCode: 200,
        message: "delete success"
      }
    }
  }

  async findProjectByUserId(id: number) {
    const data = await this.projectRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.tasks', 'task')
      .where('project.userId = :id', { id })
      .andWhere('project.status != :status', { status: ProjectStatus.DELETE })
      .getMany();

    // return data;

    return {
      statusCode: 200,
      data: data ? data : {},
    }
  }

  async deleteProjectByUserId(projectId: number, userId: number) {
    const foundProject = await this.projectRepository.findOne({ where: { projectId: projectId } });

    if (!foundProject) {
      return {
        statusCode: 404,
        message: `Project with ID ${projectId} not found`
      }
      // throw new NotFoundException(`Project with ID ${projectId} not found`);
    }
    else {
      const project = await this.projectRepository.createQueryBuilder('project')
        .leftJoinAndSelect('project.tasks', 'task')
        .where('project.projectId = :id', { id: projectId })
        .andWhere('task.status != :status', { status: 'DELETE' })
        .getMany();

      if (project.length > 0) {
        return {
          statusCode: 409,
          message: "delete failed because tasks are still in your project"
        }

      }
      else {
        const newProject = this.projectRepository.create({
          projectId: projectId,
          status: ProjectStatus.DELETE,
          modifiedDate: new Date().toISOString().slice(0, 10),
        })
        const savedProject = await this.projectRepository.save(newProject);
        return {
          statusCode: 200,
          message: "delete success"
        }
      }
    }
  }
}





