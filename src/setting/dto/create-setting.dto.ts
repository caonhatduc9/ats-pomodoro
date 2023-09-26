export class CreateSettingDto {
  pomodoroTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  autoStartBreak: number;
  autoStartPomodoro: number;
  longBreakInterval: number;
  autoSwitchTask: number;
  ringSoundId: number;
  ringSoundVolumn: number;
  ringSoundRepeat: number;
  backgroundMusicId: number;
  backgroundMusicVolumn: number;
  currentBackgroundId: number;
  darkmodeWhenRunning: number;
  pomodoroColor: string;
  shortBreakColor: string;
  longBreakColor: string;
}
