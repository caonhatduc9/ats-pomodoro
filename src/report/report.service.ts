import { Inject, Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report } from './entities/report.entity';
import { Repository } from 'typeorm';
import { dataproc } from 'googleapis/build/src/apis/dataproc';
import { User } from 'output/entities/User';

@Injectable()
export class ReportService {
  constructor(@Inject('PROJECT_REPOSITORY') private reportRepository: Repository<Report>,
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>
  ) { }

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


  async getSummaryReportByUserId(id: number): Promise<any> {
    const dataRaw = await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.projects', 'project')
      .leftJoinAndSelect('user.focusedpomodoros', 'focusedPomodoro')
      .where('user.userId = :id ', { id })
      .getMany();

    let totalTime = new Date();
    totalTime.setHours(0);
    totalTime.setMinutes(0);
    totalTime.setSeconds(0);
    const focusTime = dataRaw[0].focusedpomodoros;

    focusTime.forEach(pomodoro => {
      const timeParts = pomodoro.timeFocus.split(":");
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);
      const seconds = parseInt(timeParts[2], 10);

      totalTime.setHours(totalTime.getHours() + hours);
      totalTime.setMinutes(totalTime.getMinutes() + minutes);
      totalTime.setSeconds(totalTime.getSeconds() + seconds);
    });
    const totalHours = totalTime.getHours();
    const totalMinutes = totalTime.getMinutes();
    const totalSeconds = totalTime.getSeconds();
    const formattedTime = `${String(totalHours).padStart(2, '0')}:${String(totalMinutes).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;

    const projects = dataRaw[0].projects;

    const focusTimeCreatedDates = focusTime.map((item) => item.createdDate);
    const streak = this.countConsecutiveDays(focusTimeCreatedDates);
    const accessedDates = new Set();


    // Thêm các giá trị createdDate từ focusTime vào Set
    focusTime.forEach((item) => {
      accessedDates.add(item.createdDate);
    });

    // Đếm số ngày truy cập
    const accessedDay = accessedDates.size;
    console.log(accessedDay);
    const dateReturn = {
      activity_summary: {
        focusedHours: formattedTime,
        accessedDays: accessedDay,
        streakDays: streak
      },
      focusHours: focusTime,
      projects: projects
    }

    return {
      statusCode: 200,
      data: dateReturn ? dateReturn : {}
    };

  }
  async getDetailReportByUserId(id: number): Promise<any> {
    const dataRaw = await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.projects', 'project')
      .leftJoinAndSelect('user.tasks', 'task')
      .leftJoinAndSelect('project.tasks', 'taskProject')
      .where('user.userId = :id ', { id })
      .getMany();


    // Biến lưu trữ kết quả
    let result = [];

    // Lặp qua các project
    dataRaw[0].projects.forEach(project => {
      // Tính tổng thời gian từ các task trong project
      let totalMinutes = 0;
      project.tasks.forEach(task => {
        const [hours, minutes, seconds] = task.timeSpent.split(":");
        totalMinutes += parseInt(hours) * 60 + parseInt(minutes);
      });

      // Thêm project vào kết quả
      result.push({
        date: project.createdDate,
        project: project.projectName,
        minutes: totalMinutes
      });
    });

    // Lặp qua các task không thuộc project
    dataRaw[0].tasks.forEach(task => {
      if (task.projectId === null) {
        const [hours, minutes, seconds] = task.timeSpent.split(":");
        const taskName = task.taskName;
        const existingTask = result.find(item => item.task === taskName);
        if (existingTask) {
          // Cộng thời gian vào task đã tồn tại trong kết quả
          existingTask.minutes += parseInt(hours) * 60 + parseInt(minutes);
        } else {
          // Thêm task vào kết quả
          result.push({
            date: task.createdDate,
            task: taskName,
            minutes: parseInt(hours) * 60 + parseInt(minutes)
          });
        }
      }
    });

    console.log(result);

    return {
      statusCode: 200,
      data: result ? result : {}
    }
  }
}