import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards, Put } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from 'src/v1/auth/guards/auth.jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('/v1/task')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Post()
  async createTask(@Req() req: any, @Body() body: any, @Query('project') project: string) {
    console.log("project ", project);
    return await this.projectService.createTask(req.user.userId, body, project);
  }

  @Get()
  async getTaskByUserId(@Req() req: any) {
    return this.projectService.findTaskByUserId(req.user.userId);
  }

  @Patch()
  async updateTaskByUserId(@Body() body: any, @Req() req: any) {
    return this.projectService.updateTaskByUserId(body, +req.user.userId);
  }
  @Delete()
  async deleteTaskByUserId(@Body() body: any, @Req() req: any) {
    return this.projectService.deleteTaskByUserId(+body.taskId, +req.user.userId);
  }

  @Delete('/empty')
  async deleteAllTasks(@Req() req: any) {
    return this.projectService.deleteAllTasksByUserId(+req.user.userId);
  }

  @Post('/createProject')
  async createProject(@Req() req: any, @Body() body: any) {
    return this.projectService.createProject(req.user.userId, body);
  }

  @Get('/getProjects')
  async getProjectByUserId(@Req() req: any) {
    return this.projectService.findProjectByUserId(req.user.userId);
  }

  @Patch('/updateProject')
  async updateProjectByUserId(@Body() body: any, @Req() req: any) {
    return this.projectService.updateProjectByUserId(body, +req.user.userId);
  }

  @Delete('/deleteProject')
  async deleteProjectByUserId(@Body() body: any, @Req() req: any) {
    return this.projectService.deleteProjectByUserId(+body.projectId, +req.user.userId);
  }
}

  
