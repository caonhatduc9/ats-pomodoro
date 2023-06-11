import { FocusedPomodoro } from "./focusedPomodoro.interface";
import { Project } from "./project.interface";

export interface ReportData {
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