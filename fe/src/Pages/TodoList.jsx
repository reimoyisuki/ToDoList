import { useState, useEffect } from 'react';
import { useAuth } from '../Component/auth-context';
import Navbar from '../Component/Navbar';
import axios from 'axios';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [selectedTab, setSelectedTab] = useState('personal');
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [severity, setSeverity] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Pastikan user ada sebelum melakukan fetch
        if (!user?._id) return;

        if (selectedTab === 'personal') {
          const response = await axios.get(`/api/todo/${user._id}`);
          setTasks(response.data?.data || []);
        } else {
          // Untuk group tasks, Anda perlu menyesuaikan endpoint
          const response = await axios.get(`/api/todo/group/${user._id}`);
          setTasks(response.data?.data || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [selectedTab, user]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim() || !user?._id) return;
    
    try {
      setLoading(true);
      const response = await axios.post('/api/todo/create', {
        userId: user._id,
        groupId: selectedTab === 'group' ? 'GROUP_ID_HERE' : null,
        content: newTask,
        severity: severity
      });

      setTasks(prevTasks => [...prevTasks, response.data?.data || {}]);
      setNewTask('');
      setSeverity(2);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('Error adding task:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (id) => {
    try {
      const taskToUpdate = tasks.find(task => task._id === id);
      if (!taskToUpdate) return;
      
      const newStatus = taskToUpdate.status === 'finished' ? 'todo' : 'finished';
      
      await axios.put(`/api/todo/update/${id}`, {
        status: newStatus,
        userId: user?._id,
        content: taskToUpdate.content,
        severity: taskToUpdate.severity
      });

      setTasks(prevTasks => 
        prevTasks.map(task =>
          task._id === id ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('Error updating task:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      if (!user?._id) return;
      
      await axios.delete(`/api/todo/delete/${id}`, {
        data: { userId: user._id }
      });
      
      setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('Error deleting task:', err);
    }
  };

  const getSeverityColor = (severityValue) => {
    switch (severityValue) {
      case 1: return 'bg-green-600';
      case 2: return 'bg-yellow-600';
      case 3: return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'todo': return 'To Do';
      case 'ongoing': return 'In Progress';
      case 'finished': return 'Completed';
      default: return status;
    }
  };

  // Pastikan user sudah terload sebelum render komponen utama
  if (!user) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-amber-400">Loading user data...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <Navbar isOpen={isNavOpen} toggleNavbar={() => setIsNavOpen(!isNavOpen)} />
      
      <main className={`transition-all duration-300 ${isNavOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="max-w-4xl mx-auto p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-800 text-red-100 rounded-md">
              {error}
            </div>
          )}
          
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-amber-400">
              {selectedTab === 'personal' ? 'Personal Tasks' : 'Group Tasks'}
            </h1>
            <div className="flex gap-2 bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => setSelectedTab('personal')}
                className={`px-4 py-2 rounded-md ${
                  selectedTab === 'personal' 
                    ? 'bg-amber-700 text-amber-100' 
                    : 'text-gray-400 hover:bg-gray-700'
                }`}
              >
                Personal
              </button>
              <button
                onClick={() => setSelectedTab('group')}
                className={`px-4 py-2 rounded-md ${
                  selectedTab === 'group' 
                    ? 'bg-amber-700 text-amber-100' 
                    : 'text-gray-400 hover:bg-gray-700'
                }`}
              >
                Group
              </button>
            </div>
          </div>

          <form onSubmit={addTask} className="mb-8">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder={`Add a new ${selectedTab} task...`}
                className="flex-1 px-4 py-2 bg-gray-800 border border-amber-700 rounded-md text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                disabled={loading}
              />
              <select
                value={severity}
                onChange={(e) => setSeverity(parseInt(e.target.value))}
                className="px-3 py-2 bg-gray-800 border border-amber-700 rounded-md text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                disabled={loading}
              >
                <option value={1}>Low</option>
                <option value={2}>Medium</option>
                <option value={3}>High</option>
              </select>
              <button
                type="submit"
                className="px-6 py-2 bg-amber-700 hover:bg-amber-600 text-amber-100 rounded-md transition-colors disabled:opacity-50"
                disabled={loading || !newTask.trim()}
              >
                {loading ? 'Adding...' : 'Add Task'}
              </button>
            </div>
          </form>

          {loading && !tasks.length ? (
            <div className="text-center py-8 text-amber-400">Loading tasks...</div>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task._id || Math.random().toString(36).substr(2, 9)}
                  className={`flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700/50 transition-colors ${
                    task.status === 'finished' ? 'opacity-70' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={task.status === 'finished'}
                      onChange={() => toggleTask(task._id)}
                      className="w-5 h-5 text-amber-600 bg-gray-700 rounded border-gray-600"
                    />
                    <div className="flex flex-col flex-1">
                      <span className={`text-amber-100 ${task.status === 'finished' ? 'line-through' : ''}`}>
                        {task.content || 'Untitled Task'}
                      </span>
                      <div className="flex gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded ${getSeverityColor(task.severity)}`}>
                          {task.severity === 1 ? 'Low' : task.severity === 2 ? 'Medium' : 'High'}
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-gray-700">
                          {getStatusText(task.status)}
                        </span>
                        {task.groupId && (
                          <span className="text-xs px-2 py-1 rounded bg-purple-600">
                            Group Task
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="text-red-400 hover:text-red-300 transition-colors ml-2"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              ))}
              
              {tasks.length === 0 && !loading && (
                <div className="text-center py-8 text-amber-600">
                  No tasks found. Start adding some!
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TodoList;