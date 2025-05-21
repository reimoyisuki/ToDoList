import { useState, useEffect } from 'react';
import { useAuth } from '../Component/auth-context';
import Navbar from '../Component/Navbar';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [selectedTab, setSelectedTab] = useState('personal');
  const [isNavOpen, setIsNavOpen] = useState(true);
  const { user } = useAuth();

  // Mock data untuk contoh
  const mockTasks = [
    { id: 1, text: 'Personal Task 1', completed: false, isGroup: false },
    { id: 2, text: 'Group Task 1', completed: true, isGroup: true, groupName: 'Project X' },
  ];

  useEffect(() => {
    // TODO: Fetch tasks from API
    setTasks(mockTasks.filter(task => 
      selectedTab === 'personal' ? !task.isGroup : task.isGroup
    ));
  }, [selectedTab]);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const newTaskObj = {
      id: Date.now(),
      text: newTask,
      completed: false,
      isGroup: selectedTab === 'group'
    };
    
    setTasks([...tasks, newTaskObj]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <Navbar isOpen={isNavOpen} toggleNavbar={() => setIsNavOpen(!isNavOpen)} />
      
      <main className={`transition-all duration-300 ${isNavOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="max-w-4xl mx-auto p-6">
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

          <form onSubmit={addTask} className="mb-8 flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder={`Add a new ${selectedTab} task...`}
              className="flex-1 px-4 py-2 bg-gray-800 border border-amber-700 rounded-md text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-amber-700 hover:bg-amber-600 text-amber-100 rounded-md transition-colors"
            >
              Add Task
            </button>
          </form>

          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-5 h-5 text-amber-600 bg-gray-700 rounded border-gray-600"
                  />
                  <span className={`text-amber-100 ${task.completed ? 'line-through opacity-60' : ''}`}>
                    {task.text}
                    {task.isGroup && (
                      <span className="ml-2 text-xs text-amber-400">({task.groupName})</span>
                    )}
                  </span>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
            
            {tasks.length === 0 && (
              <div className="text-center py-8 text-amber-600">
                No tasks found. Start adding some!
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TodoList;