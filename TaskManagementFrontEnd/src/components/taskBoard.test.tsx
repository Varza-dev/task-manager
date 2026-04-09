import { render, screen } from '@testing-library/react';
import { TaskBoard } from './taskBoard';
import { vi, describe, it, expect } from 'vitest';
import { TaskStatus } from "../types";

vi.mock('../hooks/useTasks', () => ({
    useTasks: () => ({
        tasks: [
            { taskId: 1, title: 'Test Task 1', status: TaskStatus.New },
            { taskId: 2, title: 'Test Task 2', status: TaskStatus.InProgress },
            { taskId: 3, title: 'Test Task 3', status: TaskStatus.Done },
        ],
        loading: false,
        error: null,
        refresh: vi.fn(),
    }),
}));

vi.mock('canvas-confetti', () => ({
    default: vi.fn(),
}));

describe('TaskBoard Rendering', () => {
    it('renders the action bar and all three task lanes', () => {
        render(<TaskBoard />);

        // Verify the Action Bar (via the "Add Task" functionality)
        expect(screen.getByRole('button', { name: /new/i })).toBeInTheDocument();

        // Verify the Lane Headings using the "getByRole" method we found successful
        expect(screen.getByRole('heading', { name: /new/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /in progress/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /done/i })).toBeInTheDocument();
    });

    it('renders the individual tasks within their correct lanes', () => {
        render(<TaskBoard />);

        // Verify the tasks from our mock are visible
        expect(screen.getByText('Test Task 1')).toBeInTheDocument();
        expect(screen.getByText('Test Task 2')).toBeInTheDocument();
        expect(screen.getByText('Test Task 3')).toBeInTheDocument();
    });
});