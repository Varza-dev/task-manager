import React, { useState } from 'react';
import type { Task, TaskCreateDto, TaskUpdateDto } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave } from '@fortawesome/free-solid-svg-icons';

interface Props {
    isOpen: boolean;
    isSaving?: boolean;
    onClose: () => void;
    onSave: (task: TaskCreateDto | TaskUpdateDto) => void;
    initialTask?: Task;
}

/**
 * This is the Task editing/creation modal. If an initial task is given, this will be "edit" mode.
 * If not initial task is passed in, the modal opens in "Create new task" mode with placeholder text.
 * @param isOpen - property managing the open state of the modal
 * @param isSaving - property managing the "save in progress" mode of this modal
 * @param onClose - callback when closing the modal
 * @param onSave - callback when saving the task edited in the modal
 * @param initialTask - existing task to open for the "edit" mode of this modal
 */
export const TaskDetailsModal = ({ isOpen, isSaving, onClose, onSave, initialTask }: Props) => {
    const [title, setTitle] = useState(initialTask?.title ?? '');
    const [description, setDescription] = useState(initialTask?.description ?? '');
    const [dueDate, setDueDate] = useState(
        initialTask?.dueDate ? initialTask.dueDate.split('T')[0] : ""
    );

    // Task validity gate for enabling or disabling the save button. For now, only a title is required.
    const isValidTask = title.trim();

    const today = new Date().toISOString().split('T')[0];

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValidTask) return;

        onSave({
            title,
            description: description.trim() || undefined,
            dueDate: dueDate ? new Date(dueDate).toISOString() : undefined
        });
    };

    return (
        <div className="modal-overlay">
            <div className="task-modal">
                <header className="task-modal__header">
                    <h3>{initialTask ? 'Edit Task' : 'Create New Task'}</h3>
                    <button onClick={onClose} className="task-modal__close-btn">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </header>

                <form onSubmit={handleSubmit}>
                    <div className="task-modal__field">
                        <label className="task-modal__label">Title *</label>
                        <input
                            autoFocus
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What needs to be done?"
                            className="task-modal__input"
                            required
                        />
                    </div>

                    <div className="task-modal__field">
                        <label className="task-modal__label">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add some details..."
                            className="task-modal__input task-modal__input--textarea"
                        />
                    </div>

                    <div className="task-modal__field">
                        <label className="task-modal__label">Due Date
                            <small style={{ color: '#888', fontWeight: 400}}> (Optional)</small>
                        </label>

                        <input
                            type="date"
                            min={today}
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="task-modal__input"
                        />
                    </div>

                    <footer className="task-modal__footer">
                        <button type="button" onClick={onClose} className="btn btn--cancel">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSaving || !isValidTask} className="btn btn--save">
                            {isSaving ? "Saving..." : <><FontAwesomeIcon icon={faSave} /> Save Task</>}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};