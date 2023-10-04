import { Inject, Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report } from './entities/report.entity';
import { Repository } from 'typeorm';
import { dataproc } from 'googleapis/build/src/apis/dataproc';
import { User } from '../../src/entities/user.entity';
import {
  FocusedPomodoro,
  Project,
  ReportData,
  SummaryReportResponse,
} from './interfaces/index.interface';

import * as moment from 'moment';

@Injectable()
export class ReportService {
  constructor(
    @Inject('PROJECT_REPOSITORY') private reportRepository: Repository<Report>,
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
  ) {}

  // calculateStreakDay(focusedPomodoros) {
  //   const sortedPomodoros = focusedPomodoros.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));
  //   let streak = 0;
  //   let currentDate = new Date();

  //   for (let i = sortedPomodoros.length - 1; i >= 0; i--) {
  //     const pomodoroDate = new Date(sortedPomodoros[i].createdDate);
  //     const diffInDays = Math.floor((currentDate - pomodoroDate) / (1000 * 60 * 60 * 24));

  //     if (diffInDays === 0 || (diffInDays === 1 && streak === 0)) {
  //       streak++;
  //       currentDate = pomodoroDate;
  //     } else {
  //       break;
  //     }
  //   }
  // }

  countConsecutiveDays(dates: string[]): number {
    console.log(
      '🚀 ~ file: report.service.ts:43 ~ ReportService ~ countConsecutiveDays ~ dates:',
      dates,
    );
    dates.sort();

    let maxConsecutiveDays = 1;
    let currentConsecutiveDays = 1;

    for (let i = 1; i < dates.length; i++) {
      const currentDate = new Date(dates[i]);
      const previousDate = new Date(dates[i - 1]);
      const currentTimestamp = currentDate.getTime();
      const previousTimestamp = previousDate.getTime();
      const timeDifference = currentTimestamp - previousTimestamp;

      if (timeDifference === 86400000) {
        // 86400000 milliseconds = 1 day
        currentConsecutiveDays++;
        if (currentConsecutiveDays > maxConsecutiveDays) {
          maxConsecutiveDays = currentConsecutiveDays;
        }
      } else {
        currentConsecutiveDays = 1;
      }
    }

    return maxConsecutiveDays;
  }

  async getSummaryReportByUserId(id: number): Promise<any> {
    const [projectDataRaw, taskDataRaw] = await Promise.all([
      this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.projects', 'projects')
        .leftJoinAndSelect('user.tasks', 'tasks')
        .where('user.userId = :id ', { id })
        .andWhere('projects.status != :status', { status: 'DELETE' })
        .getMany(),
      this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.tasks', 'tasks')
        .where('user.userId = :id ', { id })
        .andWhere('tasks.status != :status', { status: 'DELETE' })
        .getMany(),
    ]);
    // return [taskDataRaw, projectDataRaw];
    const focusHours = [];
    let projects = [];
    projects = projectDataRaw.length > 0 ? projectDataRaw[0].projects : [];

    let tasks = [];
    tasks = taskDataRaw.length > 0 ? taskDataRaw[0].tasks : [];
    // const dateReturn: ReportData = {};

    // if (tasks.length > 0) {
    // const tasks = taskDataRaw[0].tasks;
    let totalTimeSpent = 0;
    const focusTimeCreatedDates: string[] = [];
    const accessedDates = new Set();
    tasks.forEach((task) => {
      totalTimeSpent += task.timeSpent;
      const focusHour = {
        timeFocus: task.timeSpent,
        createdDate: task.createdDate,
      };
      focusHours.push(focusHour);
      focusTimeCreatedDates.push(task.createdDate);
      accessedDates.add(task.createdDate);
    });
    const streak = this.countConsecutiveDays(focusTimeCreatedDates);
    // Thêm các giá trị createdDate từ focusTime vào Set va tinh total minutes
    const accessedDay = accessedDates.size;
    const dataReturn: ReportData = {
      activitySummary: {
        focusedHours: totalTimeSpent,
        accessedDays: accessedDay,
        streakDays: streak,
      },
      focusHours,
      projects,
    };

    return {
      statusCode: 200,
      data: dataReturn,
    };
    // }
    // if()
    return {
      statusCode: 204,
      data: { tasks, projects },
    };
  }

  filterDataByDate(
    focusTime: FocusedPomodoro[],
    projects: Project[],
    startDate: Date,
  ): { focusTime: FocusedPomodoro[]; projects: Project[] } {
    const filteredFocusTime = focusTime.filter(
      (item) => new Date(item.createdDate) >= startDate,
    );
    const filteredProjects = projects.filter(
      (item) => new Date(item.createdDate) >= startDate,
    );

    return {
      focusTime: filteredFocusTime,
      projects: filteredProjects,
    };
  }

  async getDetailReportByUserId(id: number): Promise<any> {
    const dataRaw = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.projects', 'project')
      .leftJoinAndSelect('user.tasks', 'task')
      .leftJoinAndSelect('project.tasks', 'taskProject')
      .where('user.userId = :id ', { id })
      .getMany();

    // Biến lưu trữ kết quả
    const result = [];

    // Lặp qua các project
    dataRaw[0].projects.forEach((project) => {
      // Tính tổng thời gian từ các task trong project
      let totalMinutes = 0;
      project.tasks.forEach((task) => {
        // const [hours, minutes, seconds] = task.timeSpent.split(":");
        // totalMinutes += parseInt(hours) * 60 + parseInt(minutes);
        totalMinutes += +task.timeSpent;
      });
      const dateString: string = project.createdDate;
      // Tạo đối tượng Moment từ chuỗi ngày
      const date: moment.Moment = moment(dateString);
      // Định dạng ngày theo mẫu 'DD-MMM-YYYY'
      const formattedDate: string = date.format('YYYY-MM-DD');
      // Thêm project vào kết quả
      result.push({
        date: formattedDate,
        project: project.projectName,
        minutes: totalMinutes,
      });
    });

    // Lặp qua các task không thuộc project
    dataRaw[0].tasks.forEach((task) => {
      if (task.projectId === null) {
        // const [hours, minutes, seconds] = task.timeSpent.split(":");
        const taskName = task.taskName;
        const existingTask = result.find((item) => item.task === taskName);
        if (existingTask) {
          // Cộng thời gian vào task đã tồn tại trong kết quả
          existingTask.minutes += task.timeSpent;
        } else {
          const dateString: string = task.createdDate;
          // Tạo đối tượng Moment từ chuỗi ngày
          const date: moment.Moment = moment(dateString);
          // Định dạng ngày theo mẫu 'DD-MMM-YYYY'
          const formattedDate: string = date.format('YYYY-MM-DD');
          // Thêm task vào kết quả
          result.push({
            date: formattedDate,
            task: taskName,
            minutes: task.timeSpent,
          });
        }
      }
    });

    console.log(result);

    return {
      statusCode: 200,
      data: result ? result : {},
    };
  }
}
