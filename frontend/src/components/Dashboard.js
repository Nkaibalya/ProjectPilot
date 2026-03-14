import React, { useEffect, useState } from 'react';
import { fetchDashboardStats, fetchProjects, fetchIssues } from '../api';
import { Link } from 'react-router-dom';
import { Layers, ListChecks, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({ total_projects: 0, total_issues: 0, open_issues: 0 });
    const [recentProjects, setRecentProjects] = useState([]);
    const [recentIssues, setRecentIssues] = useState([]);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [statsData, projectsData, issuesData] = await Promise.all([
                    fetchDashboardStats(),
                    fetchProjects(),
                    fetchIssues()
                ]);
                setStats(statsData);
                // show last 3 items
                setRecentProjects(projectsData.slice(-3).reverse());
                setRecentIssues(issuesData.slice(-5).reverse());
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            }
        };
        loadDashboard();
    }, []);

    const getStatusIcon = (status) => {
        switch(status) {
            case 'DONE': return <CheckCircle2 size={16} className="text-success" />;
            case 'IN_PROGRESS': return <Activity size={16} className="text-warning" />;
            default: return <ListChecks size={16} className="text-primary" />;
        }
    }

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>Overview</h1>
            
            <div className="grid-3" style={{ marginBottom: '3rem' }}>
                <div className="glass-panel stat-card">
                    <Layers size={32} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
                    <h3>Total Projects</h3>
                    <div className="value">{stats.total_projects}</div>
                </div>
                <div className="glass-panel stat-card">
                    <ListChecks size={32} color="var(--text-secondary)" style={{ marginBottom: '1rem' }} />
                    <h3>Total Issues</h3>
                    <div className="value" style={{ color: "var(--text-primary)"}}>{stats.total_issues}</div>
                </div>
                <div className="glass-panel stat-card">
                    <Activity size={32} color="var(--warning-color)" style={{ marginBottom: '1rem' }} />
                    <h3>Open Issues</h3>
                    <div className="value" style={{ color: "var(--warning-color)"}}>{stats.open_issues}</div>
                </div>
            </div>

            <div className="grid-3" style={{ gridTemplateColumns: '1fr 2fr' }}>
                <div className="glass-panel">
                    <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Recent Projects</h2>
                        <Link to="/projects" className="flex items-center gap-2" style={{ fontSize: '0.85rem' }}>View all <ArrowRight size={14}/></Link>
                    </div>
                    {recentProjects.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No projects yet.</p> : (
                        recentProjects.map(project => (
                            <Link to={`/projects/${project.id}/issues`} key={project.id} className="list-item" style={{ display: 'block', padding: '1rem 0' }}>
                                <h4 style={{ margin: '0 0 0.25rem 0', color: '#fff' }}>{project.name}</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {project.description || 'No description'}
                                </p>
                            </Link>
                        ))
                    )}
                </div>

                <div className="glass-panel">
                    <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Recent Activity</h2>
                    </div>
                    {recentIssues.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No recent issues.</p> : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {recentIssues.map(issue => (
                                <Link to={`/issues/${issue.id}`} key={issue.id} className="flex justify-between items-center" style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                    <div className="flex items-center gap-4">
                                        {getStatusIcon(issue.status)}
                                        <div>
                                            <div style={{ fontWeight: 500, color: '#fff' }}>{issue.title}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                Project ID: {issue.project_id} • Priority: <span className={`badge badge-${issue.priority.toLowerCase()}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>{issue.priority}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`badge badge-${issue.status.toLowerCase().replace('_', '-')}`}>{issue.status.replace('_', ' ')}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
