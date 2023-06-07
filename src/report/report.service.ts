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

  async getSummaryReportByUserId(id: number): Promise<any> {
    // const dataRaw = await this.reportRepository.createQueryBuilder('project')
    //   .leftJoinAndSelect('project.user', 'user')
    //   .leftJoinAndSelect('user.focusedpomodoros', 'focusedPomodoro')
    //   .where('user.userId = :id ', { id })
    //   .getMany();

    const dataRaw = await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.projects', 'project')
      .leftJoinAndSelect('user.focusedpomodoros', 'focusedPomodoro')
      .where('user.userId = :id ', { id })
      .getMany();

    // return dataRaw;
    let focusedHourses = 0;
    // const projects = (dataRaw as any[]).map(item => {
    //   // console.log("proID", projectId);
    let totalTime = new Date();
    totalTime.setHours(0);
    totalTime.setMinutes(0);
    totalTime.setSeconds(0);
    // const totalHours = totalTime.getHours();
    // const totalMinutes = totalTime.getMinutes();
    // const totalSeconds = totalTime.getSeconds();
    // const formattedTime = `${String(totalHours).padStart(2, '0')}:${String(totalMinutes).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;

    // console.log("Total Focus Time 1:", formattedTime);
    const focusTime = dataRaw[0].focusedpomodoros;

    focusTime.forEach(pomodoro => {
      const timeParts = pomodoro.timeFocus.split(":");
      console.log("cehck", timeParts);
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);
      const seconds = parseInt(timeParts[2], 10);

      totalTime.setHours(totalTime.getHours() + hours);
      totalTime.setMinutes(totalTime.getMinutes() + minutes);
      totalTime.setSeconds(totalTime.getSeconds() + seconds);

      const totalHours = totalTime.getHours();
      const totalMinutes = totalTime.getMinutes();
      const totalSeconds = totalTime.getSeconds();
      const formattedTime = `${String(totalHours).padStart(2, '0')}:${String(totalMinutes).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;

      console.log("Total Focus Time:", formattedTime);


    });
    const totalHours = totalTime.getHours();
    const totalMinutes = totalTime.getMinutes();
    const totalSeconds = totalTime.getSeconds();
    const formattedTime = `${String(totalHours).padStart(2, '0')}:${String(totalMinutes).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;

    console.log("Total Focus Time:", formattedTime);
    const projects = dataRaw[0].projects;
    console.log("focusTime", focusTime);
    return { projects, focusTime, formattedTime };


    // });
    // (dataRaw as any[]).forEach(item => {
    // const focusTime = item.user.focusedpomodoros;
    (dataRaw as any[]).forEach(item => {
      const focusTime = item.user.focusedpomodoros;
      console.log("focusTime", focusTime);
      focusTime.forEach(pomodoro => {
        const timeParts = pomodoro.timeFocus.split(":");
        console.log("cehck", timeParts);
        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1], 10);
        const seconds = parseInt(timeParts[2], 10);

        totalTime.setHours(totalTime.getHours() + hours);
        totalTime.setMinutes(totalTime.getMinutes() + minutes);
        totalTime.setSeconds(totalTime.getSeconds() + seconds);

        const totalHours = totalTime.getHours();
        const totalMinutes = totalTime.getMinutes();
        const totalSeconds = totalTime.getSeconds();
        const formattedTime = `${String(totalHours).padStart(2, '0')}:${String(totalMinutes).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;

        console.log("Total Focus Time:", formattedTime);
      });
      // });



      const { projectId, userId, projectName, description, createdDate, modifiedDate } = item;
      // console.log("focus", focusTime);
      const data = { projectId, userId, projectName, description, createdDate, modifiedDate };
      // console.log("data", data);
    });
    // const totalHours = totalTime.getHours();
    // const totalMinutes = totalTime.getMinutes();
    // const totalSeconds = totalTime.getSeconds();
    // const formattedTime = `${String(totalHours).padStart(2, '0')}:${String(totalMinutes).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;

    // console.log("Total Focus Time:", formattedTime);



    // console.log(projects);
  }
}
