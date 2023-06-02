import { Inject, Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report } from './entities/report.entity';
import { Repository } from 'typeorm';
import { dataproc } from 'googleapis/build/src/apis/dataproc';

@Injectable()
export class ReportService {
  constructor(@Inject('PROJECT_REPOSITORY') private reportRepository: Repository<Report>) { }
  async getSummaryReportByUserId(id: number): Promise<any> {
    const dataRaw = await this.reportRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.user', 'user')
      .leftJoinAndSelect('user.focusedpomodoros', 'focusedPomodoro')
      .where('user.userId = :id ', { id })
      .getMany();

    let focusedTime = 0;
    const projects = (dataRaw as any[]).map(item => {
      // console.log("proID", projectId);
      const { projectId, userId, projectName, description, createdDate, modifiedDate } = item;
      // console.log(a);
      return { projectId, userId, projectName, description, createdDate, modifiedDate };
    });


    console.log(projects);
    return dataRaw;
  }
}
