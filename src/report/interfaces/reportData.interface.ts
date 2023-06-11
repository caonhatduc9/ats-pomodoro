import { ActivitySummary } from "./activitySumary.interface";
import { FocusedPomodoro } from "./focusedPomodoro.interface";
import { Project } from "./project.interface";

export interface ReportData {
    activitySummary: ActivitySummary;
    week: {
        focusHours: FocusedPomodoro[];
        projects: Project[];
    };
    month: {
        focusHours: FocusedPomodoro[];
        projects: Project[];
    };
    year: {
        focusHours: FocusedPomodoro[];
        projects: Project[];
    };
}