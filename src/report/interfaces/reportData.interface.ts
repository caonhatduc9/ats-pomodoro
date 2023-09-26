import { ActivitySummary } from './activitySumary.interface';
import { FocusedPomodoro } from './focusedPomodoro.interface';
import { Project } from './project.interface';

export interface ReportData {
  activitySummary: ActivitySummary;
  focusHours: FocusedPomodoro[];
  projects: Project[];
}
