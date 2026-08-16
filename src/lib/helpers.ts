import { Project, Document, SharedPhoto } from "@/types/db";
import { Coordinates } from "@/types/location";

export function toLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${month}-${day}`;
}

export function formatDate(
  date: Date,
  opts: { year?: boolean } = { year: true },
): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    ...(opts.year ? { year: "numeric" } : {}),
  });
  return formatter.format(date);
}

export function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }); // 2:15 PM
}

export function getDateRange(photos: SharedPhoto[]): string {
  if (photos.length === 0) return "";

  let earliest = photos[0].created_at;
  let latest = photos[0].created_at;
  for (const photo of photos) {
    if (photo.created_at < earliest) earliest = photo.created_at;
    if (photo.created_at > latest) latest = photo.created_at;
  }

  const start = formatDate(new Date(earliest), { year: false });
  const end = formatDate(new Date(latest), { year: false });

  return start === end ? start : `${start} – ${end}`;
}

export function formatFileSize(bytes: number | null): string {
  if (bytes === null) return "—";
  if (bytes < 1024 * 1024) {
    const kb = bytes / 1024;
    return `${kb.toFixed(0)} KB`;
  }

  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

export function groupPhotosByDate<T extends { created_at: string }>(
  photos: T[],
): Record<string, T[]> {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const todayKey = toLocalDate(today);
  const yesterdayKey = toLocalDate(yesterday);

  // Newest first — so day-groups insert in reverse-chronological order,
  // and photos within each day are newest-first too.
  const sorted = [...photos].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const groups: Record<string, T[]> = {};

  for (const photo of sorted) {
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

export function groupDocumentsByDate(
  documents: Document[],
): Record<string, Document[]> {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const todayKey = toLocalDate(today);
  const yesterdayKey = toLocalDate(yesterday);
  const groups: Record<string, Document[]> = {};

  for (const document of documents) {
    const documentDate = new Date(document.uploaded_at);
    const documentKey = toLocalDate(documentDate);

    let label: string;

    if (documentKey === todayKey) {
      label = "Today";
    } else if (documentKey === yesterdayKey) {
      label = "Yesterday";
    } else {
      label = formatDate(documentDate);
    }

    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(document);
  }

  return groups;
}

export function userInitials(name: string): string {
  const [first, last] = name.split(" ");
  return `${first[0].toUpperCase()}${last[0].toUpperCase()}`;
}

export function companyFirstTwoInitals(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
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

export async function downloadFilesToDevice(
  files: { url: string; name: string }[],
): Promise<void> {
  for (const file of files) {
    const res = await fetch(file.url);
    if (!res.ok) continue;
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = file.name;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
  }
}

export function getCurrentPosition(): Promise<Coordinates> {
  return Promise.race([
    new Promise<Coordinates>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) =>
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }),
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    }),
    new Promise<Coordinates>((_, reject) =>
      setTimeout(() => reject(new Error("Geolocation timed out.")), 12000),
    ),
  ]);
}

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return "No photos yet";
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

export function getGreating(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  if (hour < 18) return "Afternoon";
  return "Evening";
}
