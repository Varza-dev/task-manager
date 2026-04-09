import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { type Task } from '../types';
import { getUrgencyColor } from "../utils/dueDateUtils.ts";
import React from "react";

interface Props {
    task: Task;
    onDelete: (id: number) => void;
    onEdit: (task: Task) => void;
}

export const TaskCard = ({ task, onEdit, onDelete }: Props) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.taskId,
    });

    const urgencyColor = getUrgencyColor(task.dueDate);
    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
    const currentYear = new Date().getFullYear();

    const formattedDate = dueDate
        ? new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            // Only include the year if it's not the current one
            year: dueDate.getFullYear() !== currentYear ? 'numeric' : undefined
        }).format(dueDate)
        : null;

    // Dynamic CSS
    const dynamicStyles: React.CSSProperties = {
        transform: CSS.Translate.toString(transform),
        transition: isDragging ? 'none' : 'box-shadow 0.3s ease, transform 0.1s ease',
        boxShadow: task.dueDate ? `0 2px 12px ${urgencyColor}33` : undefined,
    };

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`task-card ${isDragging ? 'task-card--dragging' : ''}`}
            style={dynamicStyles}
        >
            <div className="task-card__header">
                <button
                    className="edit-btn-faint"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(task);
                    }}
                    title="Edit Task"
                >
                    <FontAwesomeIcon icon={faPencilAlt} size="sm" />
                </button>

                <h4 className="task-card__title">{task.title}</h4>

                <button
                    className="delete-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(task.taskId);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    title="Delete Task"
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>

            <p className="task-card__description">{task.description}</p>

            {formattedDate && (
                <div className="task-card__footer" style={{ color: urgencyColor }}>
                    <span>{formattedDate}</span>
                </div>
            )}
        </div>
    );
};