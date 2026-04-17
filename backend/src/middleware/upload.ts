import fs from 'fs';
import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

const MAX_SIZE = 5 * 1024 * 1024;

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file. Max 5MB, JPEG/PNG only'));
  }
};

function createStorage(destination: string): multer.StorageEngine {
  fs.mkdirSync(destination, { recursive: true });
  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, destination),
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  });
}

export const uploadTransformation = multer({
  storage: createStorage('uploads/transformations/'),
  fileFilter,
  limits: { fileSize: MAX_SIZE },
});

export const uploadAbout = multer({
  storage: createStorage('uploads/about/'),
  fileFilter,
  limits: { fileSize: MAX_SIZE },
});
