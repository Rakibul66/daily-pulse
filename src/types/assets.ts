export interface AssetItem {
  id: string;
  companyId: string;
  name: string;
  category: string;
  vendor: string;
  warrantyDate: string;
  serialNumber: string;
  status: 'Active' | 'Under Repair' | 'Retired';
  assignedTo?: string;
  purchaseDate?: string;
  cost?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
