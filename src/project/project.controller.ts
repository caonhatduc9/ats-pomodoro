import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
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
}

  // @Get()
  // findAll() {
  //   return this.projectService.findAll();
  // }

