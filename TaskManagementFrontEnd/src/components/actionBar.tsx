import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface Props {
    onAddTask: () => void;
}

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