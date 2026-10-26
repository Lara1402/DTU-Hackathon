import { Router } from 'express';
import { gemmaService } from '../services/gemmaService.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { issueDescription, components, selectedId, errorContext } = req.body;
    if (!issueDescription || typeof issueDescription !== 'string') {
      return res.status(400).json({ success: false, error: 'Issue description is required' });
    }
    if (!Array.isArray(components)) {
      return res.status(400).json({ success: false, error: 'Components tree is required' });
    }

    const diagnosis = await gemmaService.diagnoseIssue({
      issueDescription,
      components,
      selectedId,
      errorContext
    });

    res.json(diagnosis);
  } catch (error) {
    console.error('Issue diagnosis error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to diagnose issue'
    });
  }
});

export default router;
