import { Router } from 'express';
import { db } from '../services/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// All project routes require authentication
router.use(authenticateToken);

/**
 * GET /api/projects
 * List all saved projects for the authenticated user
 */
router.get('/', (req, res) => {
  try {
    const projects = db.getProjectsByUserId(req.user.id);
    res.json({
      success: true,
      projects
    });
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve projects.' });
  }
});

/**
 * POST /api/projects
 * Create a new project for the authenticated user
 */
router.post('/', (req, res) => {
  try {
    const { name, palette, components = [], versions = [] } = req.body;

    const newProject = {
      id: `proj_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      userId: req.user.id,
      name: (name && name.trim()) || 'Untitled Project',
      palette: palette || { name: 'dark-professional' },
      components: Array.isArray(components) ? components : [],
      versions: Array.isArray(versions) ? versions : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = db.saveProject(newProject);
    res.status(201).json({
      success: true,
      project: saved
    });
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ success: false, error: 'Failed to create project.' });
  }
});

/**
 * GET /api/projects/:id
 * Retrieve a specific project (must be owned by the authenticated user)
 */
router.get('/:id', (req, res) => {
  try {
    const project = db.getProjectById(req.params.id, req.user.id);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found.' });
    }

    if (project.unauthorized) {
      return res.status(403).json({
        success: false,
        error: 'Access denied: You do not have permission to view this project.'
      });
    }

    res.json({
      success: true,
      project
    });
  } catch (err) {
    console.error('Error retrieving project:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve project.' });
  }
});

/**
 * PUT /api/projects/:id
 * Update project details (must be owned by the authenticated user)
 */
router.put('/:id', (req, res) => {
  try {
    const { name, palette, components, versions } = req.body;
    const existing = db.getProjectById(req.params.id, req.user.id);

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Project not found.' });
    }

    if (existing.unauthorized) {
      return res.status(403).json({
        success: false,
        error: 'Access denied: You cannot modify another user\'s project.'
      });
    }

    const updated = {
      ...existing,
      name: name !== undefined ? name : existing.name,
      palette: palette !== undefined ? palette : existing.palette,
      components: components !== undefined ? components : existing.components,
      versions: versions !== undefined ? versions : existing.versions,
      updatedAt: new Date().toISOString()
    };

    db.saveProject(updated);

    res.json({
      success: true,
      project: updated
    });
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ success: false, error: 'Failed to update project.' });
  }
});

/**
 * DELETE /api/projects/:id
 * Delete a project (must be owned by the authenticated user)
 */
router.delete('/:id', (req, res) => {
  try {
    const success = db.deleteProject(req.params.id, req.user.id);

    if (success === true) {
      return res.json({ success: true, message: 'Project deleted successfully.' });
    }

    if (success && success.unauthorized) {
      return res.status(403).json({
        success: false,
        error: 'Access denied: You cannot delete another user\'s project.'
      });
    }

    res.status(404).json({ success: false, error: 'Project not found.' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ success: false, error: 'Failed to delete project.' });
  }
});

export default router;
