import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Project, ProjectStatus } from '../../entities/project.entity';
import { Task, TaskStatus } from '../../entities/task.entity';
import { Repository } from 'typeorm';
import { async } from 'rxjs';
import { Category } from 'src/entities/category.entity';

@Injectable()
export class TaskService {
  constructor(
    @Inject('PROJECT_REPOSITORY')
    private projectRepository: Repository<Project>,
    @Inject('TASK_REPOSITORY') private taskRepository: Repository<Task>,
    @Inject('CATEGORY_REPOSITORY')
    private categoryRepository: Repository<Category>,
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
        categoryId: body.categoryId,
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
      .leftJoinAndSelect('task.category', 'category')
      .where('task.userId = :id', { id })
      // .andWhere('task.status != :status', { status: TaskStatus.DELETE })
      .getMany();

    // return data;

    return {
      statusCode: 200,
      data: data ? data : {},
    };
  }

  async updateTaskByUserId(updateFields: Record<string, any>, userId: number) {
    console.log(
      '🚀 ~ file: task.service.ts:130 ~ TaskService ~ updateTaskByUserId ~ body:',
      updateFields,
    );

    const foundTask = await this.taskRepository.findOne({
      where: { taskId: updateFields.taskId },
    });
    if (foundTask) {
      //delete project of task
      if (Object.keys(updateFields).length == 1) {
        const newTask = this.taskRepository.create({
          taskId: updateFields.taskId,
          projectId: null,
        });
        // console.log(body.taskId);
        const savedTask = await this.taskRepository.save(newTask);
        return {
          statusCode: 200,
          message: 'update success',
        };
      }
      if (Object.keys(updateFields).length >= 2) {
        console.log(updateFields.taskId);
        const savedTask = await this.taskRepository.save(updateFields);
        return {
          statusCode: 200,
          message: 'update success',
        };
      } else if (
        Object.keys(updateFields).length >= 2 &&
        foundTask.projectId != null
      ) {
        const foundProject = await this.projectRepository.findOne({
          where: { projectId: updateFields.projectId },
        });
        if (foundProject) {
          console.log('found project', foundProject);
          const newProject = this.projectRepository.create({
            projectId: updateFields.projectId,
            projectName: updateFields.projectName,
            modifiedDate: new Date().toISOString().slice(0, 10),
          });
          const updatedProject = await this.projectRepository.save(newProject);
          // return savedProject;
          console.log(updatedProject);
          console.log(updateFields.taskName);
          const newTask = this.taskRepository.create({
            projectId: updateFields.projectId,
            taskId: updateFields.taskId,
            taskName: updateFields.taskName,
            estimatePomodoro: updateFields.estimatePomodoro,
            note: updateFields.note,
            modifiedDate: new Date().toISOString().slice(0, 10),
            status: updateFields.status,
            timeSpent: updateFields.timeSpent,
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
  async getListCategory(): Promise<any> {
    const data = await this.categoryRepository.find();
    // return data;
    return {
      statusCode: 200,
      data: data ? data : [],
    };
  }
}
