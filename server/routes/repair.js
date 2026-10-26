import { Router } from 'express';
import { gemmaService } from '../services/gemmaService.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { components, repairPatch } = req.body;
    if (!Array.isArray(components)) {
      return res.status(400).json({ success: false, error: 'Components array is required' });
    }
    if (!repairPatch || typeof repairPatch !== 'object') {
      return res.status(400).json({ success: false, error: 'Repair patch object is required' });
    }

    const result = gemmaService.applyRepair({ components, repairPatch });
    res.json(result);
  } catch (error) {
    console.error('Repair application error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to apply repair'
    });
  }
});

export default router;
