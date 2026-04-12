import { render, screen } from '@testing-library/react';
import { TaskLane } from './taskLane';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { TaskStatus, type Task } from '../types';
import { useDroppable } from '@dnd-kit/core';

vi.mock('@dnd-kit/core', () => ({
    useDroppable: vi.fn(() => ({
        setNodeRef: vi.fn(),
        isOver: false,
        node: { current: null },
        over: null,
        active: null,
        rect: { current: null },
    })),
}));

vi.mock('./taskCard', () => ({
    TaskCard: ({ task }: { task: Task }) => (
        <div data-testid="mock-task-card">{task.title}</div>
    ),
}));

describe('TaskLane', () => {
    const mockTasks: Task[] = [
        {
            taskId: 1,
            title: 'Task 1',
            description: 'D1',
            status: TaskStatus.New,
            createdAt: '2026-04-10T12:00:00Z',
            deleted: false
        },
        {
            taskId: 2,
            title: 'Task 2',
            description: 'D2',
            status: TaskStatus.New,
            createdAt: '2026-04-10T12:00:00Z',
            deleted: false
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useDroppable).mockReturnValue({
            setNodeRef: vi.fn(),
            isOver: true,
        } as unknown as ReturnType<typeof useDroppable>);
    });

    it('renders the title and the correct number of tasks', () => {
        render(
            <TaskLane
                title="To Do"
                tasks={mockTasks}
                taskStatus={TaskStatus.New}
                onEditTask={vi.fn()}
                onDeleteTask={vi.fn()}/>
        );

        expect(screen.getByText(/To Do \(2\)/i)).toBeInTheDocument();

        expect(screen.getAllByTestId('mock-task-card')).toHaveLength(2);
    });

    it('shows empty state when task list is empty', () => {
        render(
            <TaskLane
                title="Done"
                tasks={[]}
                taskStatus={TaskStatus.Done}
                onEditTask={vi.fn()}
                onDeleteTask={vi.fn()}/>
        );

        expect(screen.getByText(/no tasks to display/i)).toBeInTheDocument();
        expect(screen.queryByTestId('mock-task-card')).not.toBeInTheDocument();
    });

    it('applies the "is-over" class and shows placeholder when dragging over', () => {
        vi.mocked(useDroppable).mockReturnValue({
            setNodeRef: vi.fn(),
            isOver: true,
        } as unknown as ReturnType<typeof useDroppable>);

        const { container } = render(
            <TaskLane
                title="In Progress"
                tasks={[]}
                taskStatus={TaskStatus.InProgress}
                onEditTask={vi.fn()}
                onDeleteTask={vi.fn()}/>
        );

        expect(container.firstChild).toHaveClass('task-lane--is-over');

        const placeholder = container.querySelector('.task-lane__placeholder');
        expect(placeholder).toBeInTheDocument();
    });
});