import type {Task, TaskCreateDto, TaskUpdateDto} from '../types/task';
import axiosClient from "./axiosClient.ts";

export const taskService = {
    // Get all tasks
    getTasks: async (): Promise<Task[]> => {
        const response = await axiosClient.get<Task[]>(`/tasks`);
        return response.data;
    },

    // Create a new task
    createTask: async (task: TaskCreateDto): Promise<Task> => {
        const response = await axiosClient.post<Task>(`/new`, task);
        return response.data;
    },

    // Delete a task
    deleteTask: async (id: number): Promise<void> => {
        await axiosClient.delete(`/${id}`);
    },

    // Update task status only
    updateTaskStatus: async (id: number, newStatus: number): Promise<Task> => {
        const response = await axiosClient.patch<Task>(`/${id}/status`, { newStatus });
        return response.data;
    },

    // Update task title, description, and/or due date
    updateTask: async (id: number, updatedTask: TaskUpdateDto): Promise<Task> => {
        const response = await axiosClient.put<Task>(`/${id}/update`,  updatedTask);
        return response.data;
    },

    // Undelete task by id
    restoreTask: async (id: number): Promise<void> => {
        await axiosClient.post(`/${id}/restore`);
    }
};