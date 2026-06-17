import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { LogOut, Folder, PlusCircle, X } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/projects', {
        name: newProjectName,
        description: newProjectDesc
      });
      // Add the new project to the UI instantly
      setProjects([...projects, data]); 
      // Reset and close modal
      setNewProjectName('');
      setNewProjectDesc('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create project', error);
      alert('Error creating project');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <nav className="bg-white border-b shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 text-blue-600">
          <Folder className="w-6 h-6" />
          <h1 className="text-xl font-bold">Team Task Manager</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600 font-medium">Hello, {user?.name}</span>
          <button onClick={handleLogout} className="flex items-center space-x-1 text-red-500 hover:text-red-700 transition">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 mt-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Your Projects</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <PlusCircle className="w-5 h-5" />
            <span>New Project</span>
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center py-10">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 mb-4">You don't have any active projects yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div 
                key={project._id} 
                onClick={() => navigate(`/project/${project._id}`)}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-blue-400 hover:shadow-md transition cursor-pointer group"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600">{project.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description || 'No description provided.'}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-xs font-semibold">
                    {project.admin?._id === user?._id || project.admin === user?._id ? 'Admin' : 'Member'}
                  </span>
                  <span className="text-gray-500">{project.members.length} Members</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* CREATE PROJECT MODAL */}
      {isModalOpen && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Create New Project</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                <input 
                  type="text" required
                  className="w-full px-3 py-2 mt-1 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea 
                  className="w-full px-3 py-2 mt-1 border rounded focus:ring-2 focus:ring-blue-500 outline-none" rows="3"
                  value={newProjectDesc} onChange={(e) => setNewProjectDesc(e.target.value)}
                ></textarea>
              </div>
              <button type="submit" className="w-full py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition">
                Create Project
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;