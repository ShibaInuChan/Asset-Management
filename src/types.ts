export interface Asset {
  id: string;
  name: string;
  category: string;
  amount: number; // JPY
  quantity?: number; // for crypto
  unitPrice?: number; // JPY per unit
  memo?: string;
  updatedAt: string; // ISO date string
}

export interface Snapshot {
  id: string;
  date: string; // YYYY-MM
  total: number;
  byCategory: Record<string, number>;
  createdAt: string;
}
