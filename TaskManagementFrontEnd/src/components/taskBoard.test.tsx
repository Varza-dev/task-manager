import {render, screen, fireEvent, waitFor, within} from '@testing-library/react';
import { TaskBoard } from './taskBoard';
import { vi, describe, it, expect } from 'vitest';
import { TaskStatus } from "../types";

const mockTasks = [
    { taskId: 1, title: 'Test Task 1', status: TaskStatus.New, deleted: false },
    { taskId: 2, title: 'Test Task 2', status: TaskStatus.InProgress, deleted: false },
    { taskId: 3, title: 'Test Task 3', status: TaskStatus.Done, deleted: false },
];

vi.mock('../hooks/useTasks', () => ({
    useTasks: () => ({
        // Filter deleted state here for the task deletion test.
        // Normally, this is a flag that will be sent to the backend service call
        tasks: mockTasks.filter(t => !t.deleted),
        loading: false,
        error: null,
        refresh: vi.fn(),
    }),
}));

vi.mock('../api/taskService', () => ({
    taskService: {
        deleteTask: vi.fn((id) => {
            const task = mockTasks.find(t => t.taskId === id);
            if (task) task.deleted = true;
            return Promise.resolve();
        }),
        restoreTask: vi.fn((id) => {
            const task = mockTasks.find(t => t.taskId === id);
            if (task) task.deleted = false;
            return Promise.resolve();
        }),
        updateTaskStatus: vi.fn(() => Promise.resolve()),
    }
}));

describe('TaskBoard Rendering', () => {
    it('renders the action bar and all three task lanes', () => {
        render(<TaskBoard />);

        expect(screen.getByRole('button', { name: /new/i })).toBeInTheDocument();

        expect(screen.getByRole('heading', { name: /new/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /in progress/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /done/i })).toBeInTheDocument();
    });

    it('renders the individual tasks within their correct lanes', () => {
        render(<TaskBoard />);

        expect(screen.getByText('Test Task 1')).toBeInTheDocument();
        expect(screen.getByText('Test Task 2')).toBeInTheDocument();
        expect(screen.getByText('Test Task 3')).toBeInTheDocument();
    });
});

describe('TaskBoard Behavior', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('opens the edit modal when a task edit button is clicked', () => {
        render(<TaskBoard />);

        const editButtons = screen.getAllByTitle(/edit task/i);
        fireEvent.click(editButtons[0]);

        expect(screen.getByText(/edit task/i)).toBeInTheDocument();
    });

    it('removes the task on delete and restores it on undo', async () => {
        render(<TaskBoard />);

        const taskTitle = 'Test Task 1';

        const taskCard = screen.getByText(taskTitle).closest('[data-testid="task-card"]') as HTMLElement;
        const deleteBtn = within(taskCard).getByTitle(/delete task/i);
        fireEvent.click(deleteBtn);

        await waitFor(() => {
            expect(screen.queryByText(taskTitle)).not.toBeInTheDocument();
            expect(screen.getByText(/task deleted/i)).toBeInTheDocument();
        });

        const undoBtn = screen.getByRole('button', { name: /undo/i });
        fireEvent.click(undoBtn);

        await waitFor(() => {
            expect(screen.getByText(taskTitle)).toBeInTheDocument();
            expect(screen.queryByText(/task deleted/i)).not.toBeInTheDocument();
        });
    });
});