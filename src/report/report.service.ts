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
    let count = 0;
    let consecutiveCount = 0;

    for (let i = 1; i < dates.length; i++) {
      const currentDate = new Date(dates[i]);
      const previousDate = new Date(dates[i - 1]);

      // Chuyển đổi ngày thành timestamp để so sánh
      const currentTimestamp = currentDate.getTime();
      const previousTimestamp = previousDate.getTime();

      // Kiểm tra xem ngày hiện tại có liền kề ngày trước đó hay không
      if (currentTimestamp - previousTimestamp === 24 * 60 * 60 * 1000) {
        consecutiveCount++;
      } else {
        // Ngày không liền kề, cập nhật lại consecutiveCount nếu cần
        if (consecutiveCount > 0) {
          count += 1; // Đếm ngày liên tục đã tìm thấy
          consecutiveCount = 0; // Reset consecutiveCount
        }
      }
    }

    // Kiểm tra xem có ngày liên tục ở cuối mảng không
    if (consecutiveCount > 0) {
      count += 1;
    }
    return count + 1;
  }

  async getSummaryReportByUserId(id: number): Promise<SummaryReportResponse> {
    const dataRaw = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.projects', 'project')
      .leftJoinAndSelect('user.focusedPomodoros', 'focusedPomodoro')
      .where('user.userId = :id ', { id })
      .getMany();

    const focusTime: FocusedPomodoro[] = dataRaw[0].focusedPomodoros;
    const projects: Project[] = dataRaw[0].projects;

    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    let totalMinutes: number = 0;

    // Lọc dữ liệu theo tuần
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const weekData = this.filterDataByDate(focusTime, projects, weekStart);

    // Lọc dữ liệu theo tháng
    const monthStart = new Date();
    monthStart.setDate(monthStart.getDate() - 30);
    const monthData = this.filterDataByDate(focusTime, projects, monthStart);

    // Lọc dữ liệu theo năm
    const yearStart = new Date();
    yearStart.setDate(yearStart.getDate() - 365);
    const yearData = this.filterDataByDate(focusTime, projects, yearStart);

    // const projects = dataRaw[0].projects;

    const focusTimeCreatedDates = focusTime.map((item) => item.createdDate);
    const streak = this.countConsecutiveDays(focusTimeCreatedDates);
    const accessedDates = new Set();

    // Thêm các giá trị createdDate từ focusTime vào Set va tinh total minutes
    focusTime.forEach((item) => {
      totalMinutes += +item.timeFocus;
      accessedDates.add(item.createdDate);
    });

    // Đếm số ngày truy cập
    const accessedDay = accessedDates.size;

    const dateReturn: ReportData = {
      activitySummary: {
        focusedHours: totalMinutes,
        accessedDays: accessedDay,
        streakDays: streak,
      },
      focusHours: focusTime,
      projects,
      // week: {
      //   focusHours: weekData.focusTime,
      //   projects: weekData.projects,
      // },
      // month: {
      //   focusHours: monthData.focusTime,
      //   projects: monthData.projects,
      // },
      // year: {
      //   focusHours: yearData.focusTime,
      //   projects: yearData.projects,
      // },
    };

    return {
      statusCode: 200,
      data: dateReturn,
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
    let result = [];

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
