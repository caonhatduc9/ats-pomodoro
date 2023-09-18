import { Body, Controller, Delete, Get, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from 'src/v1/auth/guards/auth.jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('v1/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Delete('/empty')
  async deleteAllTasks(@Req() req: any) {
    return this.taskService.deleteAllTasksByUserId(+req.user.userId);
  }

  @Post()
  async createTask(@Req() req: any, @Body() body: any, @Query('project') project: string) {
    console.log("project ", project);
    return await this.taskService.createTask(req.user.userId, body, project);
  }

  @Get()
  async getTaskByUserId(@Req() req: any) {
    return this.taskService.findTaskByUserId(req.user.userId);
  }

  @Patch()
  async updateTaskByUserId(@Body() body: any, @Req() req: any) {
    return this.taskService.updateTaskByUserId(body, +req.user.userId);
  }
  @Delete()
  async deleteTaskByUserId(@Body() body: any, @Req() req: any) {
    return this.taskService.deleteTaskByUserId(+body.taskId, +req.user.userId);
  }
}
