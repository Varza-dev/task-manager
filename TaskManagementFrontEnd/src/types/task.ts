export const TaskStatus = {
    New: 0,
    InProgress: 1,
    Done: 2
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

// this mirrors "TaskResponseDto" from the backend
export interface Task {
    taskId: number;
    title: string;
    description?: string;
    status: TaskStatus;
    createdAt: string;
    dueDate?: string;
    deleted: boolean;
}

export interface TaskCreateDto {
    title: string;
    description?: string;
    dueDate?: string;
}

export interface TaskUpdateDto {
    title: string;
    description?: string;
    dueDate?: string;
}