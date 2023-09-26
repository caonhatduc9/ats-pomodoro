import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Project, ProjectStatus } from '../../entities/project.entity';
import { Task, TaskStatus } from '../../entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @Inject('PROJECT_REPOSITORY')
    private projectRepository: Repository<Project>,
    @Inject('TASK_REPOSITORY') private taskRepository: Repository<Task>,
  ) {}

  async createTask(userId: number, body: any, project: string) {
    if (project === 'true') {
      if (body.project.projectId == null) {
        const newProject = this.projectRepository.create({
          userId: userId,
          projectName: body.project.projectName,
          description: body.project.description,
          createdDate: new Date().toISOString().slice(0, 10),
        });
        const savedProject = await this.projectRepository.save(newProject);
        const newTask = this.taskRepository.create({
          projectId: savedProject.projectId,
          userId: userId,
          taskName: body.task.taskName,
          estimatePomodoro: body.task.estimatePomodoro,
          note: body.task.note,
          createdDate: new Date().toISOString().slice(0, 10),
          status: body.status,
        });
        const savedTask = await this.taskRepository.save(newTask);
        return {
          statusCode: 200,
          message: 'create success',
        };
      } else {
        const foundProject = await this.projectRepository.findOne({
          where: { projectId: body.project.projectId },
        });
        if (foundProject) {
          const newTask = this.taskRepository.create({
            projectId: foundProject.projectId,
            userId: foundProject.userId,
            taskName: body.task.taskName,
            estimatePomodoro: body.task.estimatePomodoro,
            note: body.task.note,
            createdDate: new Date().toISOString().slice(0, 10),
            status: body.task.status,
          });
          const savedTask = await this.taskRepository.save(newTask);
          return savedTask;
          // return {
          //   "statusCode": 200,
          //   "message": "create success"
          // }
        } else {
          const newProject = this.projectRepository.create({
            userId: userId,
            projectName: body.project.projectName,
            createdDate: new Date().toISOString().slice(0, 10),
          });
          const savedProject = await this.projectRepository.save(newProject);
          const newTask = this.taskRepository.create({
            projectId: savedProject.projectId,
            userId: userId,
            taskName: body.task.taskName,
            estimatePomodoro: body.task.estimatePomodoro,
            note: body.task.note,
            createdDate: new Date().toISOString().slice(0, 10),
            status: body.status,
          });
          const savedTask = await this.taskRepository.save(newTask);
          return savedTask;
          // return {
          //   "statusCode": 200,
          //   "message": "create success"
          // }
        }
      }
    } else {
      //day la trương hợp dễ hơ chỉ dùng table task thôi không cần project
      //implement here
      const newTask = this.taskRepository.create({
        userId,
        taskName: body.taskName,
        estimatePomodoro: body.estimatePomodoro,
        note: body.note,
        createdDate: new Date().toISOString().slice(0, 10),
        status: body.status,
      });
      const savedTask = await this.taskRepository.save(newTask);
      return savedTask;
      // return {
      //   statusCode: 200,
      //   message: "create success"
      // };
    }
  }

  async findTaskByUserId(id: number) {
    const data = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .where('task.userId = :id', { id })
      // .andWhere('task.status != :status', { status: TaskStatus.DELETE })
      .getMany();

    // return data;

    return {
      statusCode: 200,
      data: data ? data : {},
    };
  }

  async updateTaskByUserId(body: any, userId: number) {
    const foundTask = await this.taskRepository.findOne({
      where: { taskId: body.taskId },
    });
    if (foundTask) {
      if (Object.keys(body).length == 1) {
        const newTask = this.taskRepository.create({
          taskId: body.taskId,
          projectId: null,
        });
        // console.log(body.taskId);
        const savedTask = await this.taskRepository.save(newTask);
        return {
          statusCode: 200,
          message: 'update success',
        };
      }
      if (Object.keys(body).length == 2) {
        const newTask = this.taskRepository.create({
          taskId: body.taskId,
          projectId: body.projectId,
        });
        const savedTask = await this.taskRepository.save(newTask);
        return {
          statusCode: 200,
          message: 'update success',
        };
      } else if (
        Object.keys(body).length >= 2 &&
        foundTask.projectId === null
      ) {
        const newTask = this.taskRepository.create({
          // userId: foundTask.userId,
          taskId: body.taskId,
          taskName: body.taskName,
          estimatePomodoro: body.estimatePomodoro,
          note: body.note,
          actualPomodoro: body.actualPomodoro,
          modifiedDate: new Date().toISOString().slice(0, 10),
          status: body.status,
        });
        console.log(body.taskId);
        const savedTask = await this.taskRepository.save(newTask);
        return {
          statusCode: 200,
          message: 'update success',
        };
      } else if (Object.keys(body).length >= 2 && foundTask.projectId != null) {
        const foundProject = await this.projectRepository.findOne({
          where: { projectId: body.projectId },
        });
        if (foundProject) {
          console.log('found project', foundProject);
          const newProject = this.projectRepository.create({
            projectId: body.projectId,
            projectName: body.projectName,
            modifiedDate: new Date().toISOString().slice(0, 10),
          });
          const updatedProject = await this.projectRepository.save(newProject);
          // return savedProject;
          console.log(updatedProject);
          console.log(body.taskName);
          const newTask = this.taskRepository.create({
            projectId: body.projectId,
            taskId: body.taskId,
            taskName: body.taskName,
            estimatePomodoro: body.estimatePomodoro,
            note: body.note,
            modifiedDate: new Date().toISOString().slice(0, 10),
            status: body.status,
          });
          const savedTask = await this.taskRepository.save(newTask);
          return {
            statusCode: 200,
            message: 'update success',
          };
        }
      }
    }
  }
  async deleteTaskByUserId(taskId: number, userId: number) {
    const foundTask = await this.taskRepository.findOne({
      where: { taskId: taskId },
    });
    if (foundTask) {
      const newTask = this.taskRepository.create({
        taskId: taskId,
        status: TaskStatus.DELETE,
        modifiedDate: new Date().toISOString().slice(0, 10),
      });
      const savedTask = await this.taskRepository.save(newTask);
      return {
        statusCode: 200,
        message: 'delete success',
      };
    }
  }

  async deleteAllTasksByUserId(userId: number) {
    const foundTasks = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .where('task.userId = :userId', { userId })
      .andWhere('task.status != :status', { status: TaskStatus.DELETE })
      .getMany();

    foundTasks.forEach((item) => {
      if (item) {
        const data = this.taskRepository.create({
          taskId: item.taskId,
          status: TaskStatus.DELETE,
          modifiedDate: new Date().toISOString().slice(0, 10),
        });
        const savedTask = this.taskRepository.save(data);
      }
    });
    return {
      statusCode: 200,
      message: 'delete success',
    };
  }
}
