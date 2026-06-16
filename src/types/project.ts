import { Project } from "./db";

export type ProjectWithThumbnail = Project & {
  thumbnail_url: string | null;
};
