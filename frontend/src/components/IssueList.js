import React, { useState, useEffect } from 'react';
import { fetchIssues, createIssue, fetchProject, fetchUsers } from '../api';
import { useParams, Link } from 'react-router-dom';
import { Search, Plus, Filter, MessageSquare, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const IssueList = () => {
    const { projectId } = useParams();
    const [issues, setIssues] = useState([]);
    const [project, setProject] = useState(null);
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newIssue, setNewIssue] = useState({ title: '', description: '', priority: 'MEDIUM', assigned_to: '' });

    useEffect(() => {
        loadData();
    }, [projectId]);

    const loadData = async () => {
        try {
            const pData = await fetchProject(projectId);
            setProject(pData);
            
            const iData = await fetchIssues(projectId, searchTerm);
            setIssues(iData);

            const uData = await fetchUsers();
            setUsers(uData);
        } catch (error) {
            console.error("Failed to load project data", error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const data = await fetchIssues(projectId, searchTerm);
            setIssues(data);
        } catch (error) {
            console.error("Search failed", error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const payload = { 
                ...newIssue, 
                project_id: parseInt(projectId),
                assigned_to: newIssue.assigned_to === "" ? null : parseInt(newIssue.assigned_to)
            };
            
            await createIssue(payload);
            toast.success('Issue created successfully!');
            setNewIssue({ title: '', description: '', priority: 'MEDIUM', assigned_to: '' });
            setShowModal(false);
            loadData();
        } catch (error) {
            const detail = error.response?.data?.detail;
            if (Array.isArray(detail)) {
                // handle array errors
                const msg = detail.map(err => `${err.loc.join('.')}: ${err.msg}`).join(', ');
                toast.error(msg);
            } else {
                toast.error(detail || 'Failed to create issue');
            }
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'DONE': return 'badge-done';
            case 'IN_PROGRESS': return 'badge-in-progress';
            default: return 'badge-open';
        }
    }

    const getPriorityColor = (priority) => {
         switch(priority) {
            case 'HIGH': return 'badge-high';
            case 'LOW': return 'badge-low';
            default: return 'badge-medium';
        }
    }

    if (!project) return <div className="container">Loading...</div>;

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
               <div>
                  <Link to="/projects" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'inline-block' }}>← Back to Projects</Link>
                  <h1 style={{ margin: 0 }}>{project.name} / Issues</h1>
               </div>
               <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={18} /> New Issue
                </button>
            </div>

            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', flex: 1, gap: '1rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                        <input 
                            type="text" 
                            placeholder="Search issues by title..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '2.5rem', background: 'rgba(0,0,0,0.2)' }}
                        />
                    </div>
                    <button type="submit" className="btn btn-secondary">Search</button>
                </form>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="glass-panel" style={{ width: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2 style={{ marginTop: 0 }}>Create Issue</h2>
                        <form onSubmit={handleCreate}>
                            <div className="form-group">
                                <label>Title *</label>
                                <input 
                                    type="text" 
                                    value={newIssue.title} 
                                    onChange={e => setNewIssue({...newIssue, title: e.target.value})} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea 
                                    value={newIssue.description} 
                                    onChange={e => setNewIssue({...newIssue, description: e.target.value})}
                                    style={{ minHeight: '120px' }}
                                />
                            </div>
                            <div className="grid-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
                                <div className="form-group">
                                    <label>Priority</label>
                                    <select value={newIssue.priority} onChange={e => setNewIssue({...newIssue, priority: e.target.value})}>
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Assign To</label>
                                    <select value={newIssue.assigned_to} onChange={e => setNewIssue({...newIssue, assigned_to: e.target.value})}>
                                        <option value="">Unassigned</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-between" style={{ marginTop: '2rem' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create Issue</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="glass-panel" style={{ padding: 0, overflowY: 'auto', maxHeight: '600px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'var(--bg-color)' }}>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                            <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>ID</th>
                            <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Title</th>
                            <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Status</th>
                            <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Priority</th>
                            <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {issues.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    <AlertCircle size={32} style={{ opacity: 0.5, marginBottom: '1rem', display: 'block', margin: '0 auto 1rem auto' }} />
                                    No issues found. Create one to get started!
                                </td>
                            </tr>
                        ) : (
                            issues.map(issue => (
                                <tr key={issue.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} className="hover:bg-white/5">
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>#{issue.id}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <Link to={`/issues/${issue.id}`} style={{ fontWeight: 500, color: '#fff' }}>{issue.title}</Link>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span className={`badge ${getStatusColor(issue.status)}`}>{issue.status.replace('_', ' ')}</span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span className={`badge ${getPriorityColor(issue.priority)}`}>{issue.priority}</span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        {new Date(issue.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default IssueList;
