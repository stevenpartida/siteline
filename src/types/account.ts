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
  team: Array<{
    id: string;
    fullName: string;
    role: Role;
  }>;
};

export type Profile = AccountData["profile"];
export type Company = AccountData["company"];
export type Team = AccountData["team"];
export type TeamMember = AccountData["team"][number];
