export interface TaskModel {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  from: Date;
  to: Date;
  uids: string[];
  color?: string;
  attachment: Attachment[];
  progress?: number;
  isUrgent: boolean;
}

export interface Attachment {
  name: string;
  url: string;
  size: number;
  type?: string;
}

export interface SubTasks {
  createdAt: number;
  description: string;
  id: string;
  isCompleted: boolean;
  taskId: string;
  title: string;
  updatedAt: number;
}
