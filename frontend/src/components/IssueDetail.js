import React, { useState, useEffect } from 'react';
import { fetchIssue, updateIssue, fetchComments, addComment, fetchUsers } from '../api';
import { useParams, Link } from 'react-router-dom';
import { Clock, User, AlertCircle, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const IssueDetail = () => {
    const { issueId } = useParams();
    const [issue, setIssue] = useState(null);
    const [comments, setComments] = useState([]);
    const [users, setUsers] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        loadData();
    }, [issueId]);

    const loadData = async () => {
        try {
            const iData = await fetchIssue(issueId);
            setIssue(iData);
            
            const cData = await fetchComments(issueId);
            setComments(cData);

            const uData = await fetchUsers();
            setUsers(uData);
        } catch (error) {
            console.error("Failed to load issue data", error);
        }
    };

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        const previousStatus = issue.status;
        setIssue({ ...issue, status: newStatus });
        try {
            setIsUpdating(true);
            await updateIssue(issueId, { status: newStatus });
            toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
        } catch (error) {
            const detail = error.response?.data?.detail;
            toast.error(typeof detail === 'string' ? detail : 'Failed to update status');
            setIssue({ ...issue, status: previousStatus });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleAssigneeChange = async (e) => {
        const newAssignee = e.target.value === "" ? null : parseInt(e.target.value);
        const previousAssignee = issue.assigned_to;
        setIssue({ ...issue, assigned_to: newAssignee });
        try {
            setIsUpdating(true);
            await updateIssue(issueId, { assigned_to: newAssignee });
            toast.success('Assignee updated');
            loadData();
        } catch (error) {
            const detail = error.response?.data?.detail;
            toast.error(typeof detail === 'string' ? detail : 'Failed to update assignee');
            setIssue({ ...issue, assigned_to: previousAssignee });
        } finally {
             setIsUpdating(false);
        }
    }

    const handleAddComment = async (e) => {
        e.preventDefault();
        try {
            await addComment({ message: newComment, issue_id: parseInt(issueId) });
            toast.success('Comment added');
            setNewComment('');
            const cData = await fetchComments(issueId);
            setComments(cData);
        } catch (error) {
            const detail = error.response?.data?.detail;
            toast.error(typeof detail === 'string' ? detail : 'Failed to add comment');
        }
    };

    if (!issue) return <div className="container">Loading...</div>;

    const getPriorityColor = (priority) => {
         switch(priority) {
            case 'HIGH': return 'badge-high';
            case 'LOW': return 'badge-low';
            default: return 'badge-medium';
        }
    }

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
             <Link to={`/projects/${issue.project_id}/issues`} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block' }}>← Back to Issues</Link>
            
            <div className="flex justify-between items-start" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '2rem' }}>{issue.title} <span style={{ color: 'var(--text-secondary)', fontWeight: 300 }}>#{issue.id}</span></h1>
                    <div className="flex gap-4 items-center" style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <span className={`badge ${getPriorityColor(issue.priority)}`}>{issue.priority} Priority</span>
                        <span className="flex items-center gap-1"><Clock size={14} /> Opened on {new Date(issue.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            <div className="grid-3" style={{ gridTemplateColumns: '2fr 1fr' }}>
                <div>
                    <div className="glass-panel" style={{ marginBottom: '2rem', padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Description</h2>
                        <div style={{ whiteSpace: 'pre-wrap', color: '#fff', lineHeight: 1.8 }}>
                            {issue.description || <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No description provided.</span>}
                        </div>
                    </div>

                    <div style={{ marginTop: '3rem' }}>
                        <h2 className="flex items-center gap-2" style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}><MessageSquare size={20} /> Comments ({comments.length})</h2>
                        
                        {comments.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                                No comments yet.
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                                {comments.map((comment) => (
                                    <div key={comment.id} className="comment-box">
                                        <div className="comment-header">
                                            <span style={{ fontWeight: 600, color: '#fff' }}>{comment.user?.name || `User #${comment.user_id}`}</span>
                                            <span>{new Date(comment.created_at).toLocaleString()}</span>
                                        </div>
                                        <div style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>{comment.message}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <form onSubmit={handleAddComment}>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <textarea 
                                    value={newComment} 
                                    onChange={e => setNewComment(e.target.value)} 
                                    placeholder="Leave a comment..." 
                                    required 
                                    style={{ minHeight: '100px', background: 'rgba(0,0,0,0.2)' }}
                                />
                            </div>
                            <div className="flex" style={{ justifyContent: 'flex-end' }}>
                                <button type="submit" className="btn btn-primary" disabled={!newComment.trim()}>
                                    Comment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div>
                    <div className="glass-panel" style={{ padding: '2rem', position: 'sticky', top: '100px' }}>
                        <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Details</h2>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>
                                Status
                            </label>
                            <select 
                                value={issue.status} 
                                onChange={handleStatusChange} 
                                disabled={isUpdating}
                                style={{ background: 'rgba(255,255,255,0.05)', fontWeight: 500 }}
                            >
                                <option value="OPEN">Open</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="DONE">Done</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>
                                Assignee
                            </label>
                            <select 
                                value={issue.assigned_to || ""} 
                                onChange={handleAssigneeChange} 
                                disabled={isUpdating}
                                style={{ background: 'rgba(255,255,255,0.05)' }}
                            >
                                <option value="">Unassigned</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))}
                            </select>
                            {issue.assigned_to && (
                                <div className="flex items-center gap-2" style={{ marginTop: '0.75rem', color: '#fff', fontSize: '0.9rem' }}>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                                        {users.find(u => u.id === issue.assigned_to)?.name.charAt(0) || 'U'}
                                    </div>
                                    {users.find(u => u.id === issue.assigned_to)?.name}
                                </div>
                            )}
                        </div>

                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                            <label style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>
                                Project
                            </label>
                            <Link to={`/projects/${issue.project_id}/issues`} className="flex items-center gap-2" style={{ color: 'var(--primary-color)', fontWeight: 500 }}>
                                {issue.project_id}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IssueDetail;
