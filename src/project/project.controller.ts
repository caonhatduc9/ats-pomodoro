import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('/v1/task')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async create(@Req() req: any, @Body() body: any, @Query('project') project: boolean ) {
    if (project == false) {
      return await this.projectService.createTask(req.project.projectId, body, project);
      
    }
  }

  // @Get()
  // findAll() {
  //   return this.projectService.findAll();
  // }
}
