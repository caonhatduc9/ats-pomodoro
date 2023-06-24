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
  async create(@Req() req: any, @Body() body: any, @Query('project') project: string) {
    console.log("project ", project);
    return await this.projectService.createTask(req.user.userId, body, project);
  }

  @Get()
  async getByUserId(@Req() req: any) {
    return this.projectService.findTaskByUserId(req.user.userId);
  }

  @Put()
  async updateTaskByUserId(@Body() body: any, @Req() req: any) {
    return this.projectService.updateTaskByUserId(body, +req.user.userId);
  }
  @Delete()
  async deleteTaskByUserId(@Body() body: any, @Req() req: any) {
    return this.projectService.deleteTaskByUserId(+body.taskId, +req.user.userId);
  }

}

  
