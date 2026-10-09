export interface DeliveryManFormData {
  store: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  nationalId: string;
  address: string;
  status: 'ACTIVE' | 'INACTIVE';
}
