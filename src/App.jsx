import { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskFilter from './components/TaskFilter';
import './App.css';

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    sort: 'createdAt'
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const toggleComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const editTask = (editedTask) => {
    setTasks(tasks.map(task => 
      task.id === editedTask.id ? editedTask : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const filteredTasks = tasks.filter(task => {
    // Filter by status
    if (filters.status === 'completed' && !task.completed) return false;
    if (filters.status === 'active' && task.completed) return false;
    
    // Filter by priority
    if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
    
    return true;
  }).sort((a, b) => {
    // Sort by selected criteria
    if (filters.sort === 'createdAt') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (filters.sort === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    } else if (filters.sort === 'priority') {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return 0;
  });

  const activeTasks = filteredTasks.filter(task => !task.completed).length;
  const completedTasks = filteredTasks.filter(task => task.completed).length;

  return (
    <div className="task-manager">
      <header>
        <h1>Task Manager</h1>
        <p>Organize your tasks efficiently</p>
      </header>
      <main>
        <div className="sidebar">
          <TaskForm addTask={addTask} />
          <TaskFilter filters={filters} setFilters={setFilters} />
        </div>
        <div className="content">
          <h2>
            Your Tasks
            <span className="task-count">
              {activeTasks} active / {completedTasks} completed
            </span>
          </h2>
          <TaskList 
            tasks={filteredTasks}
            toggleComplete={toggleComplete}
            editTask={editTask}
            deleteTask={deleteTask}
          />
        </div>
      </main>
    </div>
  );
}

export default App;