export type BinStatus = "critical" | "warning" | "normal" | "collected";

export interface BinLocation {
  latitude: number;
  longitude: number;
}

export interface Bin {
  id: string;
  name: string;
  district: string;
  level: number;
  status: BinStatus;
  lastCollection?: string | null;
  updatedAt: string;
  routeName?: string;
  address?: string;
  location?: BinLocation;
}
