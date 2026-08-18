export type Role = "owner" | "project_manager" | "crew";

export type User = {
  id: string;
  full_name: string | null;
  created_at: string;
  company_id: string | null;
  role: Role;
  gps_autofile: boolean;
  phone: string | null;
};

export type Company = {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  license_number: string | null;
};

export type Photo = {
  id: string;
  project_id: string;
  uploaded_by: string;
  uploaded_by_name: string;
  storage_path: string;
  location: { lat: number; lng: number } | null;
  size_bytes: number | null;
  created_at: string;
};

export type Document = {
  id: string;
  project_id: string;
  uploaded_by: string;
  uploaded_by_name: string;
  name: string;
  size_bytes: number | null;
  storage_path: string;
  uploaded_at: string;
};

export type Project = {
  id: string;
  company_id: string;
  name: string;
  address: string;
  created_at: string;
  updated_at: string;
  // Resolved per request from project_stars for the *current user* — not the
  // legacy company-wide projects.is_starred column, which the app ignores.
  is_starred: boolean;
  location: { lat: number; lng: number } | null;
};

// One row per (user, project) they have starred. See
// supabase/migrations/0002_project_stars.sql.
export type ProjectStar = {
  user_id: string;
  project_id: string;
  created_at: string;
};

export type ShareViewType = "gallery" | "timeline";

export type ShareLink = {
  id: string;
  token: string;
  project_id: string;
  created_by: string;
  created_at: string;
  expires_at: string;
  view_type: ShareViewType;
};

export type SharedPhoto = {
  id: string;
  created_at: string;
  url: string;
};

export type ShareLinkPhoto = {
  share_link_id: string;
  photo_id: string;
};
