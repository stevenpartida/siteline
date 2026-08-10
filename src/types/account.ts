import { Role } from "./db";

export type AccountData = {
  profile: {
    fullName: string;
    role: Role;
    email: string;
    createdAt: string;
    gpsAutofile: boolean;
    phone: string | null;
  };
  company: {
    name: string;
    license_number: string | null;
  };
  counts: {
    members: number;
    projects: number;
  };
};

export type Profile = AccountData["profile"];
export type Company = AccountData["company"];
