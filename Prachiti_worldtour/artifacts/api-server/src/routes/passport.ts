import { Router, Request, Response } from 'express';
import { Passport, Photo } from '../models/Passport';

const router = Router();

// We'll use a hardcoded default passport ID for now since there's no auth
const PASSPORT_ID = 'default';

// Get entire passport state
router.get('/', async (req: Request, res: Response) => {
  try {
    let passport = await Passport.findOne({ passportId: PASSPORT_ID });
    
    // If it doesn't exist, return empty state (will be initialized on first save)
    if (!passport) {
      return res.json({
        progress: null,
        itinerary: null,
        scratched: null
      });
    }

    res.json(passport);
  } catch (error) {
    req.log.error(error);
    res.status(500).json({ error: 'Failed to fetch passport data' });
  }
});

// Update specific keys (progress, itinerary, scratched)
router.post('/update', async (req: Request, res: Response) => {
  try {
    const { key, value } = req.body;
    
    if (!['progress', 'itinerary', 'scratched'].includes(key)) {
      return res.status(400).json({ error: 'Invalid key' });
    }

    // Find or create
    let passport = await Passport.findOne({ passportId: PASSPORT_ID });
    if (!passport) {
      passport = new Passport({ passportId: PASSPORT_ID });
    }

    (passport as any)[key] = value;
    await passport.save();

    res.json({ success: true });
  } catch (error) {
    req.log.error(error);
    res.status(500).json({ error: 'Failed to update passport data' });
  }
});

// Get a specific photo by ID
router.get('/photo/:id', async (req: Request, res: Response) => {
  try {
    const photoId = req.params.id;
    const photo = await Photo.findOne({ passportId: PASSPORT_ID, photoId });
    
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    res.json({ base64: photo.base64 });
  } catch (error) {
    req.log.error(error);
    res.status(500).json({ error: 'Failed to fetch photo' });
  }
});

// Save a photo
router.post('/photo', async (req: Request, res: Response) => {
  try {
    const { id, base64 } = req.body;
    
    if (!id || !base64) {
      return res.status(400).json({ error: 'Missing id or base64 data' });
    }

    await Photo.findOneAndUpdate(
      { passportId: PASSPORT_ID, photoId: id },
      { base64 },
      { upsert: true, new: true }
    );

    res.json({ success: true });
  } catch (error) {
    req.log.error(error);
    res.status(500).json({ error: 'Failed to save photo' });
  }
});

export default router;
