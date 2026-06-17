import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { ArrowLeft, PlusCircle, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium', dueDate: '' });

  // Fetch both Tasks and Metrics simultaneously
  const fetchData = async () => {
    try {
      const [taskRes, metricRes] = await Promise.all([
        api.get(`/tasks/${id}`),
        api.get(`/dashboard/${id}`)
      ]);
      setTasks(taskRes.data);
      setMetrics(metricRes.data);
    } catch (error) {
      console.error("Error fetching workspace data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...newTask, project: id });
      setShowTaskForm(false);
      setNewTask({ title: '', description: '', priority: 'Medium', dueDate: '' });
      fetchData(); // Refresh the data to update metrics and the list
    } catch (error) {
      console.error("Error creating task", error);
      alert("Failed to create task");
    }
  };
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/update/${taskId}`, { status: newStatus });
      fetchData(); // Instantly refresh the metrics and task list
    } catch (error) {
      console.error("Error updating status", error);
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Workspace...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button onClick={() => navigate('/dashboard')} className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-6 transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      {/* --- DASHBOARD METRICS SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><CheckCircle className="w-6 h-6" /></div>
          <div>
            <p className="text-gray-500 text-sm">Total Tasks</p>
            <h3 className="text-2xl font-bold text-gray-800">{metrics?.totalTasks || 0}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full"><Clock className="w-6 h-6" /></div>
          <div>
            <p className="text-gray-500 text-sm">In Progress</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {metrics?.tasksByStatus.find(s => s._id === 'In Progress')?.count || 0}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-red-100 flex items-center space-x-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-full"><AlertTriangle className="w-6 h-6" /></div>
          <div>
            <p className="text-gray-500 text-sm">Overdue Tasks</p>
            <h3 className="text-2xl font-bold text-red-600">{metrics?.overdueTasks || 0}</h3>
          </div>
        </div>
      </div>

      {/* --- TASK MANAGEMENT SECTION --- */}
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Project Tasks</h2>
          <button 
            onClick={() => setShowTaskForm(!showTaskForm)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <PlusCircle className="w-5 h-5" />
            <span>{showTaskForm ? 'Cancel' : 'Add Task'}</span>
          </button>
        </div>

        {/* Task Creation Form */}
        {showTaskForm && (
          <form onSubmit={handleCreateTask} className="mb-8 p-4 bg-gray-50 border rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Task Title</label>
                <input type="text" required className="w-full px-3 py-2 border rounded outline-none" 
                  value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input type="date" required className="w-full px-3 py-2 border rounded outline-none" 
                  value={newTask.dueDate} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea required className="w-full px-3 py-2 border rounded outline-none" rows="2"
                value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} />
            </div>
            <button type="submit" className="px-6 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700">
              Save Task
            </button>
          </form>
        )}

       {/* Task List */}
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center py-6 border-2 border-dashed rounded-lg">No tasks yet. Create one above!</p>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task._id} className="p-4 border rounded-lg flex justify-between items-center hover:shadow-sm bg-white">
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">{task.title}</h4>
                  <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                  <div className="flex space-x-3 text-xs font-semibold">
                    <span className={`px-2 py-1 rounded ${task.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                      {task.priority} Priority
                    </span>
                    <span className="px-2 py-1 rounded bg-gray-100 text-gray-700">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end space-y-2">
                  {/* INTERACTIVE STATUS DROPDOWN */}
                  <select
                    value={task.status || 'To Do'}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-sm font-bold outline-none cursor-pointer appearance-none text-center
                      ${task.status === 'Done' ? 'bg-green-100 text-green-800' :
                        task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'}`}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;