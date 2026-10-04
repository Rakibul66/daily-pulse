export type LostItemStatus = 'In store' | 'Returned' | 'Disposed';

export interface LostItem {
  id: string;
  userId: string;
  refNumber: string; // e.g. LF-C6702229
  itemName: string;
  category: string;
  color: string;
  dateFound: string;
  timeFound: string;
  locationFound: string;
  publicDescription: string;
  storageNote: string;
  showPublicly: boolean;
  status: LostItemStatus;
  
  // Handover Info
  claimantName?: string;
  claimantPhone?: string;
  handoverDate?: string;
  
  createdAt: string;
  updatedAt: string;
}
