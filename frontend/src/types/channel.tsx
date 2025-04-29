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
  totalUsers?: number;
}
