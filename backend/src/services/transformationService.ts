import fs from 'fs';
import { promisify } from 'util';
import Transformation, { ITransformation } from '../models/Transformation';

const unlink = promisify(fs.unlink);

export async function addTransformation(
  data: Partial<ITransformation>,
  files: { beforeImage?: Express.Multer.File[]; afterImage?: Express.Multer.File[] }
): Promise<ITransformation> {
  const beforeImageUrl = files.beforeImage?.[0]?.path ?? '';
  const afterImageUrl = files.afterImage?.[0]?.path ?? '';
  return Transformation.create({ ...data, beforeImageUrl, afterImageUrl });
}

export async function listTransformations(): Promise<ITransformation[]> {
  return Transformation.find().sort({ createdAt: -1 });
}

export async function deleteTransformation(id: string): Promise<void> {
  const doc = await Transformation.findById(id);
  if (!doc) throw new Error('Transformation not found');

  await Promise.allSettled([
    doc.beforeImageUrl ? unlink(doc.beforeImageUrl) : Promise.resolve(),
    doc.afterImageUrl ? unlink(doc.afterImageUrl) : Promise.resolve(),
  ]);

  await doc.deleteOne();
}
