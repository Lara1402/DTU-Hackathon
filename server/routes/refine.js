import { Router } from 'express';
import { gemmaService } from '../services/gemmaService.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { prompt, components, palette, selectedId } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ success: false, error: 'A non-empty prompt is required for refinement' });
    }
    if (!Array.isArray(components)) {
      return res.status(400).json({ success: false, error: 'Components array is required' });
    }

    const result = await gemmaService.refineDesign({
      prompt,
      components,
      palette,
      selectedId
    });

    res.json(result);
  } catch (error) {
    console.error('Design refinement error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to refine design'
    });
  }
});

export default router;
