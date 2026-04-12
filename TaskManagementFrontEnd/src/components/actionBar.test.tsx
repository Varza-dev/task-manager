import { render, screen, fireEvent } from '@testing-library/react';
import { ActionBar } from './actionBar';
import { vi, describe, it, expect } from 'vitest';

describe('ActionBar Tests', () => {
    it('renders the action bar correctly', () => {
        render(<ActionBar onAddTask={() => {}} />);

        expect(screen.getByText(/my tasks/i)).toBeInTheDocument();

        const button = screen.getByRole('button', { name: /new task/i });
        expect(button).toBeInTheDocument();
    });

    it('calls onAddTask when the "New Task" button is clicked', () => {
        const onAddTaskMock = vi.fn();
        render(<ActionBar onAddTask={onAddTaskMock} />);

        const button = screen.getByRole('button', { name: /new task/i });
        fireEvent.click(button);

        expect(onAddTaskMock).toHaveBeenCalledTimes(1);
    });
});