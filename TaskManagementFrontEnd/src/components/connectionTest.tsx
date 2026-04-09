import { useTasks } from '../hooks/useTasks';

export const ConnectionTest = () => {
    const { tasks, loading, error } = useTasks();

    if (loading) return <p>Connecting to .NET backend...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
        <div>
            <h2>Backend Connection: Success!</h2>
            <p>Retrieved {tasks.length} tasks from the database.</p>
            <ul>
                {tasks.map(t => (
                    <li key={t.taskId}>{t.title} - {t.status}</li>
                ))}
            </ul>
        </div>
    );
};