import {useState, useEffect, useCallback} from 'react';
import type { Task } from '../types';
import { taskService } from '../api/taskService';

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadTasks = useCallback(async () => {
        try {
            setLoading(true);
            const data = await taskService.getTasks();
            setTasks(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    return { tasks, loading, error, refresh: loadTasks };
};