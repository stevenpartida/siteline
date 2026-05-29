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
