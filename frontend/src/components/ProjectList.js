import React, { useState, useEffect } from 'react';
import { fetchProjects, createProject } from '../api';
import { Link } from 'react-router-dom';
import { Plus, FolderOpen, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', description: '' });

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        const data = await fetchProjects();
        setProjects(data);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createProject(newProject);
            toast.success('Project created successfully!');
            setNewProject({ name: '', description: '' });
            setShowModal(false);
            loadProjects();
        } catch (error) {
            const detail = error.response?.data?.detail;
            if (Array.isArray(detail)) {
                const msg = detail.map(e => e.msg).join(', ');
                toast.error(msg);
            } else {
                toast.error(detail || 'Failed to create project');
            }
        }
    };

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <div className="page-header">
                <div>
                    <h1 style={{ marginBottom: '0.5rem' }}>Projects</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Manage your work spaces and repositories.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={18} /> New Project
                </button>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="glass-panel" style={{ width: '500px' }}>
                        <h2 style={{ marginTop: 0 }}>Create New Project</h2>
                        <form onSubmit={handleCreate}>
                            <div className="form-group">
                                <label>Project Name <span style={{color: 'var(--danger-color)'}}>*</span></label>
                                <input 
                                    type="text" 
                                    value={newProject.name} 
                                    onChange={e => setNewProject({...newProject, name: e.target.value})} 
                                    required 
                                    placeholder="e.g. Frontend Redesign"
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea 
                                    value={newProject.description} 
                                    onChange={e => setNewProject({...newProject, description: e.target.value})}
                                    placeholder="Briefly describe what this project is about..."
                                    style={{ minHeight: '80px' }}
                                />
                            </div>
                            <div className="flex justify-between" style={{ marginTop: '2rem' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create Project</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid-3">
                {projects.map(project => (
                    <Link to={`/projects/${project.id}/issues`} key={project.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                        <div className="flex items-center gap-4" style={{ marginBottom: '1rem' }}>
                            <div style={{ padding: '0.75rem', background: 'rgba(88, 166, 255, 0.1)', borderRadius: '12px' }}>
                                <FolderOpen size={24} color="var(--primary-color)" />
                            </div>
                            <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem' }}>{project.name}</h3>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', flex: 1, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            {project.description || 'No description provided.'}
                        </p>
                        <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                            <div className="flex items-center gap-2">
                                <Calendar size={14} /> {new Date(project.created_at).toLocaleDateString()}
                            </div>
                            <span>ID: {project.id}</span>
                        </div>
                    </Link>
                ))}
            </div>
            {projects.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
                    <FolderOpen size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <p>No projects found. Create one to get started!</p>
                </div>
            )}
        </div>
    );
};

export default ProjectList;
