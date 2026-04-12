import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface Props {
    onAddTask: () => void;
}

/**
 * This is the ActionBar at the top of the page, containing the board name (currently hardcoded) and
 * the "New Task" button for adding tasks.
 * @param onAddTask - call back for adding a new task
 */
export const ActionBar = ({ onAddTask }: Props) => {
    return (
        <div className="action-bar">
            <div className="action-bar__content">
                <h2 className="action-bar__title">My Tasks</h2>
                <button className="btn btn--add-task" onClick={onAddTask}>
                    <FontAwesomeIcon icon={faPlus} />
                    <span>New Task</span>
                </button>
            </div>
        </div>
    );
};