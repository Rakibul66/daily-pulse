export interface CompanyProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  tradeLicense: string;
  vat: string;
  tin: string;
  logoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Branch {
  id: string;
  companyId: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  status: 'Active' | 'Inactive';
  createdAt?: string;
  updatedAt?: string;
}
