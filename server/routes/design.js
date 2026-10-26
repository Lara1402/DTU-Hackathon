import { Router } from 'express';
import { gemmaService } from '../services/gemmaService.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { prompt, palette, moodBoard, designPreferences, model } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ success: false, error: 'A non-empty prompt is required' });
    }

    const result = await gemmaService.generateDesign({
      prompt,
      palette,
      moodBoard,
      designPreferences,
      model
    });

    res.json(result);
  } catch (error) {
    console.error('Design generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate design'
    });
  }
});

export default router;
