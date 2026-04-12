import { render, screen, fireEvent } from '@testing-library/react';
import { TaskDetailsModal } from './taskDetailsModal';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { TaskStatus } from '../types';

describe('TaskDetailsModal', () => {
    const mockOnSave = vi.fn();
    const mockOnClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.setSystemTime(new Date('2026-04-10'));
    });

    it('renders the modal in "Create task" mode when no initialTask is provided', () => {
        render(<TaskDetailsModal isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);

        expect(screen.getByText(/create new task/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/what needs to be done/i)).toHaveValue('');
    });

    it('renders "Edit" mode with initial data when initialTask is provided', () => {
        const initialTask = {
            taskId: 1,
            title: 'Existing Task',
            description: 'Existing Description',
            status: TaskStatus.New,
            dueDate: '2026-12-25T00:00:00.000Z',
            createdAt: new Date().toISOString(),
            deleted: false
        };

        render(
            <TaskDetailsModal
                isOpen={true}
                initialTask={initialTask}
                onSave={mockOnSave}
                onClose={mockOnClose}/>
        );

        expect(screen.getByText(/edit task/i)).toBeInTheDocument();
        expect(screen.getByDisplayValue('Existing Task')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Existing Description')).toBeInTheDocument();
        expect(screen.getByDisplayValue('2026-12-25')).toBeInTheDocument();
    });

    it('calls onSave with input values when form is submitted', () => {
        render(<TaskDetailsModal isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);

        const titleInput = screen.getByPlaceholderText(/what needs to be done/i);
        const descInput = screen.getByPlaceholderText(/add some details/i);
        const saveButton = screen.getByRole('button', { name: /save task/i });

        fireEvent.change(titleInput, { target: { value: 'New Test Title' } });
        fireEvent.change(descInput, { target: { value: 'New Test Description' } });
        fireEvent.click(saveButton);

        expect(mockOnSave).toHaveBeenCalledWith({
            title: 'New Test Title',
            description: 'New Test Description',
            dueDate: undefined
        });
    });

    it('shows "Saving" state when isSaving is true', () => {
        render(
            <TaskDetailsModal
                isOpen={true}
                isSaving={true}
                onSave={mockOnSave}
                onClose={mockOnClose}/>
        );

        expect(screen.getByText(/saving\.\.\./i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /saving\.\.\./i })).toBeDisabled();
    });

    it('has correct save button state based on task title input', () => {
        render(<TaskDetailsModal isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);

        const titleInput = screen.getByPlaceholderText(/what needs to be done/i);
        const saveButton = screen.getByRole('button', { name: /save task/i });
        // save button is disabled with no title
        expect(saveButton).toBeDisabled();

        fireEvent.change(titleInput, { target: { value: '   ' } });
        // save button is also disabled if title is all whitespace
        expect(saveButton).toBeDisabled();

        fireEvent.change(titleInput, { target: { value: 'Fix bugs' } });
        // save button is enabled with valid task title
        expect(saveButton).toBeEnabled();
    });

    it('calls onClose when Cancel or Close button is clicked', () => {
        render(<TaskDetailsModal isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);

        fireEvent.click(screen.getByText(/cancel/i));
        expect(mockOnClose).toHaveBeenCalledTimes(1);

        const closeBtn = document.querySelector('.task-modal__close-btn');
        if (closeBtn) fireEvent.click(closeBtn);
        expect(mockOnClose).toHaveBeenCalledTimes(2);
    });
});