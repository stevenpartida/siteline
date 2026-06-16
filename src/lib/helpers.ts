import { Photo, Project } from "@/types/db";

export function toLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${month}-${day}`;
}

export function formatDate(date: Date): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return formatter.format(date);
}

export function groupPhotosByDate(photos: Photo[]): Record<string, Photo[]> {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const todayKey = toLocalDate(today);
  const yesterdayKey = toLocalDate(yesterday);

  const groups: Record<string, Photo[]> = {};

  for (const photo of photos) {
    const photoDate = new Date(photo.created_at);
    const photoKey = toLocalDate(photoDate);

    let label: string;

    if (photoKey === todayKey) {
      label = "Today";
    } else if (photoKey === yesterdayKey) {
      label = "Yesterday";
    } else {
      label = formatDate(photoDate);
    }

    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(photo);
  }

  return groups;
}

export function userInitials(name: string): string {
  const [first, last] = name.split(" ");
  return `${first[0].toUpperCase()}${last[0].toUpperCase()}`;
}

export function searchProject<T extends Project>(
  projects: T[],
  searchQuery: string,
): T[] {
  if (!searchQuery.trim()) return projects;

  const searchLower = searchQuery.toLowerCase();

  return projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchLower) ||
      project.address.toLowerCase().includes(searchLower),
  );
}
