import { Request, Response } from 'express';
import Plan from '../models/Plan';

// Public: list active plans
export const list = async (_req: Request, res: Response) => {
  try {
    const plans = await Plan.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch plans' });
  }
};

// Admin: list all plans
export const listAll = async (_req: Request, res: Response) => {
  try {
    const plans = await Plan.find().sort({ order: 1, createdAt: 1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch plans' });
  }
};

// Admin: create plan
export const create = async (req: Request, res: Response) => {
  try {
    const plan = await Plan.create(req.body);
    res.status(201).json(plan);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create plan' });
  }
};

// Admin: update plan
export const update = async (req: Request, res: Response) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json(plan);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update plan' });
  }
};

// Admin: delete plan
export const remove = async (req: Request, res: Response) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Plan deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete plan' });
  }
};
