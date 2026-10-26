import { Router } from 'express';
import { runDiagnostics } from '../services/testRunner.js';

const router = Router();

router.post('/', (req, res) => {
  try {
    const { components, palette } = req.body;
    if (!Array.isArray(components)) {
      return res.status(400).json({ success: false, error: 'Components array is required for running diagnostics' });
    }

    const report = runDiagnostics(components, palette);
    res.json(report);
  } catch (error) {
    console.error('Test runner error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to execute test runner'
    });
  }
});

export default router;
