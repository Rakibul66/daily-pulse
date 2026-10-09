export type PaymentMethodType = 
  | 'Cash at Hand' 
  | 'Bank Transfer' 
  | 'Cheque' 
  | 'bKash / Nagad' 
  | 'Online Banking';

export const PAYMENT_METHODS: PaymentMethodType[] = [
  'Cash at Hand',
  'Bank Transfer',
  'Cheque',
  'bKash / Nagad',
  'Online Banking'
];

export interface VendorPaymentFormData {
  paymentNo: string;
  paymentDate: string;
  vendor: string;
  vendorId: string;
  paymentType: PaymentMethodType;
  amount: number;
  voucherRef: string;
  bankName: string;
  chequeNo: string;
  remarks: string;
  staff: string;
}
