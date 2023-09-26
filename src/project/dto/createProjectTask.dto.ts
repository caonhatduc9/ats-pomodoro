export class CreateProjectTaskDto {
  project: {
    userId: string;
    projectId: number;
    projectName: string;
  };

  task: {
    taskName: string;
    estimatePomodoro: number;
    note: string;
  };
}
