import { useTasks } from '../hooks/useTasks';
import {type Task, type TaskCreateDto, TaskStatus, type TaskUpdateDto} from '../types';
import { TaskLane } from './taskLane.tsx';
import { ActionBar } from "./actionBar.tsx";
import { taskService } from "../api/taskService.ts";
import { useRef, useState } from "react";
import { TaskDetailsModal } from "./taskDetailsModal.tsx";
import { closestCorners, DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import confetti from "canvas-confetti";

export const TaskBoard = () => {
    const { tasks, loading, error, refresh } = useTasks();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
    const [lastDeletedId, setLastDeletedId] = useState<number | null>(null);
    const [showUndo, setShowUndo] = useState(false);

    const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const handleSaveTask = async (targetTask: TaskCreateDto | TaskUpdateDto) => {
        try {
            if (editingTask) {
                await taskService.updateTask(editingTask.taskId, targetTask)
            }
            else {
                await taskService.createTask(targetTask);
            }
            setIsModalOpen(false); // Close modal
            setEditingTask(undefined);
            await refresh();
        } catch (err) {
            alert(`Failed to create task: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };

    const handleDeleteTask = async (id: number) => {
        //if (!window.confirm("Are you sure you want to delete this task?")) return;

        try {
            await taskService.deleteTask(id);
            setLastDeletedId(id);
            if (undoTimerRef.current) {
                clearTimeout(undoTimerRef.current);
            }
            setShowUndo(true);
            await refresh();

            // show the undo toast for 10 seconds
            undoTimerRef.current = setTimeout(() => {
                setShowUndo(false);
                setLastDeletedId(null);
            }, 10000);

        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to delete task");
        }
    };

    const handleUndo = async () => {
        if (lastDeletedId) {
            try {
                await taskService.restoreTask(lastDeletedId);
                setShowUndo(false);
                setLastDeletedId(null);
                await refresh();
            } catch (err) {
                alert(err instanceof Error ? err.message : "Failed to restore task.");
            }
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over) {
            const taskId = Number(active.id);
            const newStatus = Number(over.id);

            const targetTask = tasks.find(t => t.taskId === taskId);

            try {
                await taskService.updateTaskStatus(taskId, newStatus);

                // confetti on task completion (only if status is newly "Done", no confetti when lifting a done task
                // and dropping it back in the "Done" column
                if (newStatus === TaskStatus.Done && targetTask?.status !== TaskStatus.Done) {
                    confetti({
                        particleCount: 200,
                        startVelocity: 60,
                        spread: 80,
                        origin: { y: 0.8 },
                        ticks: 150
                    });
                }

                await refresh();
            } catch (err) {
                alert(`Task status update failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
        }
    };

    if (loading) return <div className="board-loading">Loading board...</div>;
    if (error) return <div className="board-error">Error: {error}</div>;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}>

            <div className="task-board">
                <ActionBar onAddTask={() => setIsModalOpen(true)} />

                <div className="task-board__lanes">
                    <TaskLane
                        title="New"
                        tasks={tasks.filter(t => t.status === TaskStatus.New)}
                        taskStatus={TaskStatus.New}
                        onEditTask={setEditingTask}
                        onDeleteTask={handleDeleteTask} />

                    <TaskLane
                        title="In Progress"
                        taskStatus={TaskStatus.InProgress}
                        tasks={tasks.filter(t => t.status === TaskStatus.InProgress)}
                        onEditTask={setEditingTask}
                        onDeleteTask={handleDeleteTask} />

                    <TaskLane
                        title="Done"
                        taskStatus={TaskStatus.Done}
                        tasks={tasks.filter(t => t.status === TaskStatus.Done)}
                        onEditTask={setEditingTask}
                        onDeleteTask={handleDeleteTask} />
                </div>

                <TaskDetailsModal
                    key={editingTask?.taskId ?? 'new-task'}
                    isOpen={isModalOpen || !!editingTask}
                    initialTask={editingTask}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingTask(undefined);
                    }}
                    onSave={handleSaveTask}
                />

                {showUndo && (
                    <div className="undo-toast">
                        <span>Task deleted.</span>
                        <button onClick={handleUndo}>UNDO</button>
                    </div>
                )}
            </div>
        </DndContext>
    );
};