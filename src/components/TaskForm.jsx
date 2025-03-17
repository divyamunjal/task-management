import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

function TaskForm({ addTask }) {
  const [task, setTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prevTask => ({
      ...prevTask,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newTask = {
      ...task,
      id: uuidv4(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    addTask(newTask);
    
    // Reset form
    setTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h2>Add New Task</h2>
      
      <div className="form-group">
        <label htmlFor="title">Task Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={task.title}
          onChange={handleChange}
          required
          placeholder="What needs to be done?"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description (Optional)</label>
        <textarea
          id="description"
          name="description"
          value={task.description}
          onChange={handleChange}
          placeholder="Add details about this task"
          rows="3"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="priority">Priority Level</label>
        <select
          id="priority"
          name="priority"
          value={task.priority}
          onChange={handleChange}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="dueDate">Due Date (Optional)</label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={task.dueDate}
          onChange={handleChange}
        />
      </div>
      
      <button type="submit" className="submit-btn">Add Task</button>
    </form>
  );
}

export default TaskForm;