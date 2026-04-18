import { Request, Response } from 'express';
import HeroContent from '../models/HeroContent';

const DEFAULT = {
  backgroundImageUrl: '',
  trainerImageUrl: '',
};

// Public: get hero images
export const get = async (_req: Request, res: Response) => {
  try {
    let hero = await HeroContent.findOne();
    if (!hero) hero = await HeroContent.create(DEFAULT);
    res.json(hero);
  } catch {
    res.status(500).json({ message: 'Failed to fetch hero content' });
  }
};

// Admin: update hero images
export const update = async (req: Request, res: Response) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let hero = await HeroContent.findOne();
    if (!hero) hero = await HeroContent.create(DEFAULT);

    if (files?.backgroundImage?.[0]) {
      hero.backgroundImageUrl = `uploads/hero/${files.backgroundImage[0].filename}`;
    }
    if (files?.trainerImage?.[0]) {
      hero.trainerImageUrl = `uploads/hero/${files.trainerImage[0].filename}`;
    }

    await hero.save();
    res.json(hero);
  } catch {
    res.status(500).json({ message: 'Failed to update hero content' });
  }
};
