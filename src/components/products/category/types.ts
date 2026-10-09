export const DEFAULT_VENDORS = [
  '3S Distributor',
  'A.K TRADING CORPORATION',
  'Aarong Dairy',
  'Abul Khair Consumer Point',
  'Pran Foods Limited',
  'Square Consumer Products',
  'Unilever Bangladesh',
  'ACI Limited'
];

export interface CategoryFormData {
  parentCategory: string;
  name: string;
  image: string;
  imageFileName: string;
  vendorNames: string[];
  metaTitle: string;
  metaKeyword: string;
  metaDescription: string;
  status: 'ACTIVE' | 'INACTIVE';
}
