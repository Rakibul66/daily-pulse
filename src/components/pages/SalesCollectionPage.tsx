"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { SalesCollection, CollectionInvoiceItem, DailySale } from '@/types/sales';
import { Customer } from '@/types/customer';
import { 
  getSalesCollections, 
  addSalesCollection, 
  updateSalesCollection, 
  deleteSalesCollection, 
  deleteSalesCollectionsBulk,
  getSalesInvoices 
} from '@/lib/salesStorage';
import { getCustomers } from '@/lib/customerStorage';
import { withActionLock } from '@/lib/rateLimit';
import { DeleteConfirmModal } from '../ui/DeleteConfirmModal';
import { 
  SalesCollectionFormData, 
  formatDateDDMMYYYY 
} from '../sales/collection/types';
import { SalesCollectionForm } from '../sales/collection/SalesCollectionForm';
import { SalesCollectionTable } from '../sales/collection/SalesCollectionTable';

interface Props {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SalesCollectionPage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();

  // View state: 'LIST' or 'FORM'
  const [viewMode, setViewMode] = useState<'LIST' | 'FORM'>('LIST');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Data
  const [collections, setCollections] = useState<SalesCollection[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [allInvoices, setAllInvoices] = useState<DailySale[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Filters & Table Controls
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    mode: 'single' | 'bulk';
    targetId?: string;
    targetName?: string;
  }>({
    isOpen: false,
    mode: 'single'
  });

  // ==========================================
  // FORM STATE
  // ==========================================
  const todayFormatted = useMemo(() => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}-${month}-${year}`;
  }, []);

  const [formData, setFormData] = useState<SalesCollectionFormData>({
    clientId: '',
    clientName: '',
    paymentNo: '',
    date: todayFormatted,
    paymentType: 'Cash',
    accountHead: 'Cash in Hand',
    collectionType: 'Advance',
    balance: 0,
    staff: 'Admin',
    remarks: '',
    totalCollection: 0,
    invoiceItems: []
  });

  // Load Data
  const loadAllData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [colData, custData, invData] = await Promise.all([
        getSalesCollections(user.uid, userProfile?.companyId),
        getCustomers(user.uid, userProfile?.companyId),
        getSalesInvoices(user.uid)
      ]);
      setCollections(colData);
      setCustomers(custData);
      setAllInvoices(invData);
    } catch (err) {
      console.error('Error loading sales collection records:', err);
      showToast('Failed to load collection records', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user, userProfile?.companyId]);

  // Generate Next Payment No: e.g. STC2610000002
  const generateNextPaymentNo = (): string => {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const count = collections.length + 1;
    const serial = String(count).padStart(6, '0');
    return `STC${yy}${mm}${serial}`;
  };

  // Open Add Form
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      clientId: '',
      clientName: '',
      paymentNo: generateNextPaymentNo(),
      date: todayFormatted,
      paymentType: 'Cash',
      accountHead: 'Cash in Hand',
      collectionType: 'Advance',
      balance: 0,
      staff: userProfile?.displayName || 'Admin',
      remarks: '',
      totalCollection: 0,
      invoiceItems: []
    });
    setViewMode('FORM');
  };

  // Open Edit Form
  const handleOpenEdit = (col: SalesCollection) => {
    setEditingId(col.id);
    setFormData({
      clientId: col.clientId,
      clientName: col.clientName,
      paymentNo: col.paymentNo,
      date: col.date,
      paymentType: col.paymentType,
      accountHead: col.accountHead || 'Cash in Hand',
      collectionType: col.collectionType,
      balance: col.balance || 0,
      staff: col.staff || 'Admin',
      remarks: col.remarks || '',
      totalCollection: col.amount,
      invoiceItems: col.invoiceItems || []
    });
    setViewMode('FORM');
  };

  // Handle Client Selection & Populate Invoices Due
  const handleClientChange = (clientId: string) => {
    const cust = customers.find(c => c.id === clientId);
    const clientName = cust ? (cust.businessName || cust.ownerName) : clientId;

    // Find invoices for this client
    const clientInvoices = allInvoices.filter(
      inv => (inv.clientId && inv.clientId === clientId) || 
             (inv.clientName && inv.clientName.toLowerCase() === clientName.toLowerCase())
    );

    let clientDue = 0;
    const items: CollectionInvoiceItem[] = clientInvoices.map((inv) => {
      const saleAmt = inv.netInvoiceAmount ?? inv.totalAmount ?? 0;
      const prevCollected = 0;
      const due = Math.max(0, saleAmt - prevCollected);
      clientDue += due;
      return {
        invoiceId: inv.id,
        invoiceNo: inv.invoiceNo,
        saleAmount: saleAmt,
        previousCollection: prevCollected,
        currentCollection: 0,
        dueAmount: due,
        selected: false
      };
    });

    setFormData(prev => ({
      ...prev,
      clientId: cust ? cust.id : '',
      clientName: clientName,
      balance: clientDue,
      invoiceItems: items
    }));
  };

  // Handle Invoice Checkbox Toggle
  const handleToggleInvoice = (idx: number) => {
    const updated = [...formData.invoiceItems];
    const item = updated[idx];
    item.selected = !item.selected;
    if (item.selected) {
      item.currentCollection = item.dueAmount;
    } else {
      item.currentCollection = 0;
    }

    const totalFromInvoices = updated
      .filter(i => i.selected)
      .reduce((sum, i) => sum + i.currentCollection, 0);

    setFormData(prev => ({
      ...prev,
      invoiceItems: updated,
      totalCollection: totalFromInvoices > 0 ? totalFromInvoices : prev.totalCollection
    }));
  };

  // Handle Current Collection Input Change per invoice
  const handleInvoiceCollectionChange = (idx: number, val: number) => {
    const updated = [...formData.invoiceItems];
    updated[idx].currentCollection = Number(val);
    if (Number(val) > 0) {
      updated[idx].selected = true;
    }
    const totalFromInvoices = updated
      .filter(i => i.selected)
      .reduce((sum, i) => sum + i.currentCollection, 0);

    setFormData(prev => ({
      ...prev,
      invoiceItems: updated,
      totalCollection: totalFromInvoices
    }));
  };

  // Save Collection
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.clientName.trim()) {
      showToast('Please select or specify a client', 'error');
      return;
    }

    if (Number(formData.totalCollection) <= 0) {
      showToast('Collection amount must be greater than 0', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await withActionLock('sales_collection_save', 2000, async () => {
        const payload: Omit<SalesCollection, 'id' | 'createdAt' | 'updatedAt'> = {
          userId: user.uid,
          companyId: userProfile?.companyId || user.uid,
          companyName: userProfile?.displayName || 'M/S Buyzid Rubber',
          date: formData.date || todayFormatted,
          clientId: formData.clientId || 'client-walkin',
          clientName: formData.clientName,
          collectionType: formData.collectionType,
          paymentNo: formData.paymentNo || generateNextPaymentNo(),
          paymentType: formData.paymentType,
          accountHead: formData.accountHead,
          amount: Number(formData.totalCollection),
          balance: Number(formData.balance),
          remarks: formData.remarks,
          staff: formData.staff || 'Admin',
          invoiceItems: formData.invoiceItems.filter(i => i.selected && i.currentCollection > 0)
        };

        if (editingId) {
          await updateSalesCollection(editingId, payload);
          showToast('Collection updated successfully', 'success');
        } else {
          await addSalesCollection(payload);
          showToast('Collection recorded successfully', 'success');
        }

        await loadAllData();
        setViewMode('LIST');
      });
    } catch (err: unknown) {
      console.error('Error saving collection:', err);
      const msg = err instanceof Error ? err.message : 'Failed to save collection';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Bulk & Single Delete
  const handleConfirmDelete = async () => {
    try {
      if (deleteModalState.mode === 'single' && deleteModalState.targetId) {
        await deleteSalesCollection(deleteModalState.targetId);
        showToast('Collection deleted successfully', 'success');
      } else if (deleteModalState.mode === 'bulk' && selectedIds.length > 0) {
        await deleteSalesCollectionsBulk(selectedIds);
        showToast(`Deleted ${selectedIds.length} collections`, 'success');
        setSelectedIds([]);
      }
      setDeleteModalState({ isOpen: false, mode: 'single' });
      await loadAllData();
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Failed to delete collection', 'error');
    }
  };

  // Filtered Collections
  const filteredCollections = useMemo(() => {
    return collections.filter(c => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        c.clientName.toLowerCase().includes(q) ||
        c.paymentNo.toLowerCase().includes(q) ||
        (c.companyName && c.companyName.toLowerCase().includes(q)) ||
        (c.remarks && c.remarks.toLowerCase().includes(q))
      );

      const matchesType = typeFilter === 'All' || c.paymentType === typeFilter;
      const matchesDate = !dateFilter || c.date === formatDateDDMMYYYY(dateFilter);

      return matchesSearch && matchesType && matchesDate;
    });
  }, [collections, searchQuery, typeFilter, dateFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredCollections.length / pageSize) || 1;
  const paginatedCollections = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCollections.slice(start, start + pageSize);
  }, [filteredCollections, currentPage, pageSize]);

  // Bulk Selection Toggles
  const handleToggleSelectAll = () => {
    if (selectedIds.length === paginatedCollections.length && paginatedCollections.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedCollections.map(c => c.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {viewMode === 'FORM' ? (
        <SalesCollectionForm
          editingId={editingId}
          formData={formData}
          setFormData={setFormData}
          customers={customers}
          isSaving={isSaving}
          onClientChange={handleClientChange}
          onToggleInvoice={handleToggleInvoice}
          onInvoiceCollectionChange={handleInvoiceCollectionChange}
          onSave={handleSave}
          onCancel={() => setViewMode('LIST')}
        />
      ) : (
        <SalesCollectionTable
          collections={paginatedCollections}
          isLoading={isLoading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          pageSize={pageSize}
          setPageSize={setPageSize}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          totalFilteredCount={filteredCollections.length}
          selectedIds={selectedIds}
          onToggleSelectAll={handleToggleSelectAll}
          onToggleSelectRow={handleToggleSelectRow}
          onOpenAdd={handleOpenAdd}
          onOpenEdit={handleOpenEdit}
          onDeleteSingle={(id, paymentNo) =>
            setDeleteModalState({
              isOpen: true,
              mode: 'single',
              targetId: id,
              targetName: paymentNo
            })
          }
          onDeleteBulk={() =>
            setDeleteModalState({
              isOpen: true,
              mode: 'bulk',
              targetName: `${selectedIds.length} collections`
            })
          }
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        title="Delete Collection"
        itemName={deleteModalState.targetName || 'this collection'}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalState({ isOpen: false, mode: 'single' })}
      />
    </div>
  );
};
