import { useDroppable } from '@dnd-kit/core';

import {type Task, type TaskStatus} from '../types';
import { TaskCard } from './taskCard';

interface Props {
    title: string;
    tasks: Task[];
    taskStatus: TaskStatus;
    onEditTask: (task: Task) => void;
    onDeleteTask: (id: number) => void;
}

export const TaskLane = ({ title, tasks, taskStatus, onEditTask, onDeleteTask }: Props) => {
    const { setNodeRef, isOver } = useDroppable({
        id: taskStatus, // This is the TodoStatus enum value
    });

    const laneClass = `task-lane ${isOver ? 'task-lane--is-over' : ''}`;

    return (
        <div ref={setNodeRef} className={laneClass}>
            <h3 className="task-lane__title">{title} ({tasks.length})</h3>

            {isOver && <div className="task-lane__placeholder" />}

            {tasks.map(task => (
                <TaskCard key={task.taskId}
                          task={task}
                          onEdit={onEditTask}
                          onDelete={onDeleteTask}/>
            ))}

            {tasks.length === 0 && (
                <div className="task-lane__empty-state">
                    <p className="task-lane__empty-text">No tasks to display.</p>
                </div>
            )}
        </div>
    );
};