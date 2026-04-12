import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from './taskCard';
import { vi, describe, it, expect } from 'vitest';
import { TaskStatus } from '../types';

vi.mock('@dnd-kit/core', () => ({
    useDraggable: vi.fn(() => ({
        attributes: {},
        listeners: {},
        setNodeRef: vi.fn(),
        transform: null,
        isDragging: false,
    })),
}));

describe('TaskCard', () => {
    const mockTask = {
        taskId: 25,
        title: 'Christmas',
        description: 'Too late to get more presents',
        status: TaskStatus.New,
        dueDate: '2026-12-25T00:00:00',
        createdAt: new Date().toISOString(),
        deleted: false
    };

    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    it('renders task details correctly (including footer)', () => {
        render(<TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

        expect(screen.getByText('Christmas')).toBeInTheDocument();
        expect(screen.getByText('Too late to get more presents')).toBeInTheDocument();
        expect(screen.getByText(/Dec 25/i)).toBeInTheDocument();
    });

    it('does not render the footer if there is no due date', () => {
        const noDateTask = { ...mockTask, dueDate: undefined };
        render(<TaskCard task={noDateTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

        expect(screen.queryByText(/Dec 25/i)).not.toBeInTheDocument();
    });

    it('calls onEdit when the edit button is clicked', () => {
        render(<TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

        const editBtn = screen.getByTitle(/edit task/i);
        fireEvent.click(editBtn);

        expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
    });

    it('calls onDelete with the correct taskId when delete button is clicked', () => {
        render(<TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

        const deleteBtn = screen.getByTitle(/delete task/i);
        fireEvent.click(deleteBtn);

        expect(mockOnDelete).toHaveBeenCalledWith(25);
    });
});