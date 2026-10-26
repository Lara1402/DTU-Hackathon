import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Plus, 
  FolderPlus, 
  Clock, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  LogOut, 
  Layers, 
  Palette,
  Search,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import NewProjectModal from '../Modals/NewProjectModal.jsx';

export default function Dashboard({ onOpenProject, onCreateNewProject }) {
  const { user, token, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  // Fetch projects belonging strictly to this user
  const fetchProjects = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (e) {
      console.error('Failed to fetch user projects:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [token]);

  // Delete project
  const handleDelete = async (id, name, e) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Start renaming
  const handleStartRename = (project, e) => {
    e.stopPropagation();
    setRenamingId(project.id);
    setRenameValue(project.name);
  };

  // Save rename
  const handleSaveRename = async (id, e) => {
    e.stopPropagation();
    if (!renameValue.trim()) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: renameValue.trim() })
      });
      if (res.ok) {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, name: renameValue.trim(), updatedAt: new Date().toISOString() } : p));
        setRenamingId(null);
      }
    } catch (err) {
      console.error('Rename error:', err);
    }
  };

  // Create Project handler from Modal
  const handleTemplateChosen = async (templateKey) => {
    setIsNewProjectModalOpen(false);
    onCreateNewProject(templateKey);
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'radial-gradient(circle at 50% 0%, #151828 0%, #090a0f 65%)',
      display: 'flex',
      flexDirection: 'column',
      color: 'var(--studio-text)',
      overflowY: 'auto'
    }}>
      {/* Dashboard Top Navigation */}
      <header className="studio-top-nav">
        <div className="studio-brand-group">
          <div className="studio-logo-icon">
            <Sparkles size={18} />
          </div>
          <div>
            <span className="studio-brand-title">MoodUI Studio</span>
            <span className="studio-brand-tagline">Projects Workspace</span>
          </div>
        </div>

        <div className="studio-nav-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              title={user?.email}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                fontWeight: 700
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{user?.name || 'Developer'}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--studio-text-dim)' }}>{user?.email}</span>
            </div>
          </div>

          <div style={{ width: '1px', height: '24px', background: 'var(--studio-border)', margin: '0 4px' }} />

          <button
            className="studio-btn-secondary"
            onClick={logout}
            title="Log out of MoodUI Studio"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '40px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Welcome Banner */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          paddingBottom: '24px',
          borderBottom: '1px solid var(--studio-border)'
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
              Welcome back, {user?.name ? user.name.split(' ')[0] : 'Developer'}!
            </h1>
            <p style={{ fontSize: '0.92rem', color: 'var(--studio-text-muted)' }}>
              Create, refine, and debug intelligent UI prototypes with Google Gemma 4.
            </p>
          </div>

          <button
            className="studio-btn-primary"
            style={{ padding: '12px 24px', fontSize: '0.92rem' }}
            onClick={() => setIsNewProjectModalOpen(true)}
          >
            <Plus size={18} />
            <span>Create New Project</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        {projects.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative', width: '300px' }}>
              <input
                type="text"
                placeholder="Search projects..."
                className="studio-prop-input"
                style={{ width: '100%', paddingLeft: '34px' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={15} color="var(--studio-text-dim)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--studio-text-dim)' }}>
              Showing {filteredProjects.length} of {projects.length} project{projects.length === 1 ? '' : 's'}
            </div>
          </div>
        )}

        {/* Projects Grid or Clean Empty State */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--studio-text-muted)' }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '3px solid rgba(99, 102, 241, 0.2)',
              borderTopColor: '#6366f1',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }} />
            <span>Loading your workspace projects...</span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div style={{
            background: 'rgba(17, 20, 28, 0.6)',
            border: '1px dashed var(--studio-border)',
            borderRadius: 'var(--studio-radius-lg)',
            padding: '80px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '18px'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'rgba(99, 102, 241, 0.1)',
              color: 'var(--studio-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FolderPlus size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>
                {searchQuery ? 'No matching projects found' : 'Your Workspace is Fresh & Ready'}
              </h3>
              <p style={{ maxWidth: '460px', color: 'var(--studio-text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                {searchQuery
                  ? `No projects matching "${searchQuery}". Clear your search query or create a new project.`
                  : 'You do not have any saved projects yet. Start by creating your first interface project with AI generation or direct visual design.'
                }
              </p>
            </div>
            <button
              className="studio-btn-primary"
              style={{ marginTop: '8px' }}
              onClick={() => setIsNewProjectModalOpen(true)}
            >
              <Plus size={16} />
              <span>Create Your First Project</span>
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px'
          }}>
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                style={{
                  background: 'var(--studio-surface)',
                  border: '1px solid var(--studio-border)',
                  borderRadius: 'var(--studio-radius-md)',
                  padding: '22px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--studio-primary)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--studio-shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--studio-border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={() => onOpenProject(proj)}
              >
                {/* Card Header & Renaming */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  {renamingId === proj.id ? (
                    <div style={{ display: 'flex', gap: '6px', flex: 1, marginRight: '8px' }} onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        className="studio-prop-input"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        autoFocus
                      />
                      <button
                        className="studio-icon-btn"
                        onClick={(e) => handleSaveRename(proj.id, e)}
                        title="Save name"
                      >
                        <Check size={14} color="var(--studio-accent-emerald)" />
                      </button>
                      <button
                        className="studio-icon-btn"
                        onClick={(e) => { e.stopPropagation(); setRenamingId(null); }}
                        title="Cancel"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--studio-text)' }}>
                        {proj.name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '0.75rem', color: 'var(--studio-text-dim)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} />
                          {new Date(proj.updatedAt || proj.createdAt).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>{proj.components?.length || 0} component{proj.components?.length === 1 ? '' : 's'}</span>
                      </div>
                    </div>
                  )}

                  {renamingId !== proj.id && (
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        className="studio-icon-btn"
                        style={{ width: '28px', height: '28px' }}
                        title="Rename Project"
                        onClick={(e) => handleStartRename(proj, e)}
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        className="studio-icon-btn"
                        style={{ width: '28px', height: '28px' }}
                        title="Delete Project"
                        onClick={(e) => handleDelete(proj.id, proj.name, e)}
                      >
                        <Trash2 size={13} color="var(--studio-accent-rose)" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Theme Palette Swatch Preview */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--studio-text-dim)' }}>Theme:</span>
                  <div style={{ display: 'flex', height: '14px', width: '60px', borderRadius: '3px', overflow: 'hidden' }}>
                    <span style={{ flex: 1, background: proj.palette?.primary || '#3b82f6' }} />
                    <span style={{ flex: 1, background: proj.palette?.secondary || '#60a5fa' }} />
                    <span style={{ flex: 1, background: proj.palette?.surface || '#1e293b' }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--studio-text-muted)' }}>
                    {proj.palette?.name || 'Default'}
                  </span>
                </div>

                {/* Card Action Link */}
                <div style={{
                  marginTop: 'auto',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--studio-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.82rem',
                  color: 'var(--studio-primary)',
                  fontWeight: 600
                }}>
                  <span>Open in Studio</span>
                  <ExternalLink size={14} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onSelectTemplate={handleTemplateChosen}
      />
    </div>
  );
}
