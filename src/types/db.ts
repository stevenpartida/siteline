export type User = {
  id: string;
  full_name: string | null;
  created_at: string;
  company_id: string;
  role: "owner" | "crew";
};

export type Company = {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
};

export type Photo = {
  id: string;
  project_id: string;
  uploaded_by: string;
  uploaded_by_name: string;
  storage_path: string;
  created_at: string;
};

export type Document = {
  id: string;
  project_id: string;
  uploaded_by: string;
  uploaded_by_name: string;
  name: string;
  storage_path: string;
  uploaded_at: string;
};
