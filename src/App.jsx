import { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskFilter from './components/TaskFilter';
import taskService from './services/task.service';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    sort: 'createdAt'
  });

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const data = await taskService.getTasks();
      if(data.success){
        setTasks(data.taskList)
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch tasks from API
  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (newTask) => {
    try {
      setIsLoading(true);
      // Remove id as MongoDB will generate one
      const { id, ...taskData } = newTask;
      const createdTask = await taskService.createTask(taskData);
      if(createdTask.success){
        fetchTasks()
      }
      
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      if (!task) return;
      
      const updatedTask = { ...task, completed: !task.completed };
      await taskService.updateTask(taskId, updatedTask);
      
      setTasks(tasks.map(task => 
        task._id === taskId ? { ...task, completed: !task.completed } : task
      ));
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task. Please try again.');
    }
  };

  const editTask = async (editedTask) => {
    try {
      await taskService.updateTask(editedTask._id, editedTask);
      setTasks(tasks.map(task => 
        task._id === editedTask._id ? editedTask : task
      ));
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task. Please try again.');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again.');
    }
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
        <div className="header-content">
          <h1>Task Manager</h1>
        </div>
        <p>Organize your tasks efficiently</p>
      </header>
      
      {error && <div className="error-message">{error}</div>}
      
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
          
          {isLoading ? (
            <div className="loading">Loading tasks...</div>
          ) : (
            <TaskList 
              tasks={filteredTasks}
              toggleComplete={toggleComplete}
              editTask={editTask}
              deleteTask={deleteTask}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;