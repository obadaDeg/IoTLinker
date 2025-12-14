export interface Channel {
  id: string;
  name: string;
  author: string;
  access: "Private" | "Public";
  created: string;
  entries: number;
  fields: number;
  lastUpdate: string;
  description: string;
  tags: string[];
  updated: string; // Added to match mock data
  totalUsers?: number;
}
