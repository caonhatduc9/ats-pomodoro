export interface Project {
  projectId: number;
  userId: number;
  projectName: string;
  description: string;
  createdDate: string;
  modifiedDate: string | null;
}
