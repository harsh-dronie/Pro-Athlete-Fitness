import AboutContent, { IAboutContent } from '../models/AboutContent';

export async function getAbout(): Promise<IAboutContent | null> {
  return AboutContent.findOne();
}

export async function updateAbout(
  data: Partial<IAboutContent>,
  profileImagePath?: string
): Promise<IAboutContent> {
  if (profileImagePath) {
    data.profileImageUrl = profileImagePath;
  }

  const result = await AboutContent.findOneAndUpdate({}, data, {
    upsert: true,
    new: true,
  });

  return result!;
}
