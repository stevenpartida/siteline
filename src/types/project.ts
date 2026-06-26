import { Project } from "./db";

export type ProjectWithThumbnail = Project & {
  thumbnail_url: string | null;
};

export type ProjectSettings = Pick<
  Project,
  "id" | "name" | "address" | "created_at"
> & {
  photoCount: number;
  docCount: number;
};
