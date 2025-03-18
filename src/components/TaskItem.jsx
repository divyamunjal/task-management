import { useState } from 'react';

function TaskItem({ task, toggleComplete, editTask, deleteTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    editTask(editedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  const priorityClass = `priority-${task.priority}`;
  const completedClass = task.completed ? 'completed' : '';

  return (
    <div className={`task-item ${priorityClass} ${completedClass}`}>
      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            name="title"
            value={editedTask.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            value={editedTask.description || ''}
            onChange={handleChange}
            rows="2"
            placeholder="Task description"
          />
          <select
            name="priority"
            value={editedTask.priority}
            onChange={handleChange}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <input
            type="date"
            name="dueDate"
            value={editedTask.dueDate ? new Date(editedTask.dueDate).toISOString().split('T')[0] : ''}
            onChange={handleChange}
          />
          <div className="edit-buttons">
            <button onClick={handleSave}>Save Changes</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-header">
            <div className="task-checkbox">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task._id)}
              />
              <h3 className={task.completed ? 'completed-title' : ''}>
                {task.title}
              </h3>
            </div>
            <div className="task-actions">
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={() => deleteTask(task._id)}>Delete</button>
            </div>
          </div>
          <div className="task-body">
            {task.description && <p>{task.description}</p>}
            <div className="task-meta">
              <span className="priority">
                <span className={`priority-dot ${task.priority}`}></span>
                {task.priority} priority
              </span>
              {task.dueDate && (
                <span className="due-date">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default TaskItem;