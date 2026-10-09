"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { SalesReturn, SalesReturnItem, DailySale } from '@/types/sales';
import { Customer } from '@/types/customer';
import { Product } from '@/types/product';
import { Branch } from '@/types/company';
import { 
  getSalesReturns, 
  addSalesReturn, 
  updateSalesReturn, 
  deleteSalesReturn, 
  deleteSalesReturnsBulk,
  generateSalesReturnNo,
  DEFAULT_SALES_STORES,
  getSalesInvoices
} from '@/lib/salesStorage';
import { getCustomers } from '@/lib/customerStorage';
import { getProducts } from '@/lib/productStorage';
import { getBranches } from '@/lib/companyStorage';
import { withActionLock } from '@/lib/rateLimit';
import { DeleteConfirmModal } from '../ui/DeleteConfirmModal';
import { RetailReturnForm } from '../sales/return/RetailReturnForm';
import { RetailReturnTable } from '../sales/return/RetailReturnTable';

interface Props {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

// Format date to DD-MM-YYYY
const formatDateDDMMYYYY = (dateInput?: string): string => {
  if (!dateInput) {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateInput)) return dateInput;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    const parts = dateInput.split('-');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateInput;
};

export const SalesReturnPage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();

  // View state: 'LIST' or 'FORM'
  const [viewMode, setViewMode] = useState<'LIST' | 'FORM'>('LIST');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Data states
  const [returns, setReturns] = useState<SalesReturn[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [productsCatalog, setProductsCatalog] = useState<Product[]>([]);
  const [allInvoices, setAllInvoices] = useState<DailySale[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // List filters & controls
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [storeFilter, setStoreFilter] = useState<string>('All');
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
    mode: 'single',
  });

  // Form State
  const [formSelectedInvoice, setFormSelectedInvoice] = useState<string>('');
  const [formClient, setFormClient] = useState<{ id: string; name: string; phone?: string }>({ id: '', name: '', phone: '' });
  const [formReturnDate, setFormReturnDate] = useState<string>(formatDateDDMMYYYY());
  const [formReturnNo, setFormReturnNo] = useState<string>('');
  const [formStore, setFormStore] = useState<string>(DEFAULT_SALES_STORES[0] || 'Main Branch');
  const [formReturnReason, setFormReturnReason] = useState<string>('');
  const [formStaff, setFormStaff] = useState<string>('Admin');
  const [formItems, setFormItems] = useState<SalesReturnItem[]>([]);

  // Calculate stores list from branches or defaults
  const storeOptions = useMemo(() => {
    if (branches && branches.length > 0) {
      return branches.map(b => b.name);
    }
    return DEFAULT_SALES_STORES;
  }, [branches]);

  // Load Data
  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const companyId = userProfile?.companyId || user.uid;
      const [returnsData, customersData, productsData, invoicesData, branchesData] = await Promise.all([
        getSalesReturns(user.uid, companyId),
        getCustomers(user.uid, companyId),
        getProducts(user.uid, companyId),
        getSalesInvoices(user.uid),
        getBranches(companyId),
      ]);
      setReturns(returnsData || []);
      setCustomers(customersData || []);
      setProductsCatalog(productsData || []);
      setAllInvoices(invoicesData || []);
      setBranches(branchesData || []);
    } catch (err) {
      console.error('Error loading sales returns:', err);
      showToast('Failed to load sales returns data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, userProfile?.companyId]);

  // Compute Total Return Amount in Form
  const formReturnAmount = useMemo(() => {
    return formItems
      .filter(item => item.selected !== false)
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [formItems]);

  // Open "ADD NEW" Form
  const handleOpenAddForm = async () => {
    setEditingId(null);
    setFormSelectedInvoice('');
    setFormClient({ id: '', name: '', phone: '' });
    setFormReturnDate(formatDateDDMMYYYY());
    const nextNo = await generateSalesReturnNo(user?.uid || '', userProfile?.companyId);
    setFormReturnNo(nextNo);
    setFormStore(storeOptions[0] || 'Main Branch');
    setFormReturnReason('');
    setFormStaff(userProfile?.displayName || user?.displayName || 'Admin');
    setFormItems([]);
    setViewMode('FORM');
  };

  // Open "EDIT" Form
  const handleOpenEditForm = (item: SalesReturn) => {
    setEditingId(item.id);
    setFormSelectedInvoice(item.invoiceNo || '');
    setFormClient({
      id: item.clientId || '',
      name: item.clientName || 'Walk-in Customer',
      phone: item.customerPhone || '',
    });
    setFormReturnDate(formatDateDDMMYYYY(item.returnDate));
    setFormReturnNo(item.returnNo || 'RR26100001');
    setFormStore(item.storeName || storeOptions[0] || 'Main Branch');
    setFormReturnReason(item.returnReason || '');
    setFormStaff(item.staff || userProfile?.displayName || 'Admin');
    setFormItems(
      (item.items || []).map(it => ({
        ...it,
        selected: it.selected !== false,
      }))
    );
    setViewMode('FORM');
  };

  // When an Invoice is selected from dropdown, populate the items table
  const handleSelectInvoice = (invoiceNo: string) => {
    setFormSelectedInvoice(invoiceNo);
    if (!invoiceNo) {
      setFormItems([]);
      return;
    }

    const foundInv = allInvoices.find(inv => inv.invoiceNo === invoiceNo);
    if (foundInv) {
      setFormClient({
        id: foundInv.clientId || '',
        name: foundInv.clientName || 'Walk-in Customer',
        phone: foundInv.clientPhone || '',
      });
      if (foundInv.storeName) {
        setFormStore(foundInv.storeName);
      }

      const mappedItems: SalesReturnItem[] = (foundInv.items || []).map((prod, index) => {
        const qty = Number(prod.quantity) || 1;
        const rate = Number(prod.rate) || 0;
        return {
          id: `item-${index}-${Date.now()}`,
          productId: prod.id,
          productName: prod.productName,
          code: (prod as any).code || (prod as any).itemCode || prod.id || '',
          invoiceNo: foundInv.invoiceNo,
          salesQty: qty,
          returnedQty: 0,
          currentReturn: 1,
          rate: rate,
          amount: rate * 1,
          selected: true,
        };
      });

      setFormItems(mappedItems);
      showToast(`Loaded ${mappedItems.length} products from ${invoiceNo}`, 'info');
    }
  };

  // Update a field in a Return Item row
  const handleUpdateItem = (id: string, field: keyof SalesReturnItem, value: any) => {
    setFormItems(prev =>
      prev.map(it => {
        if (it.id === id) {
          const updated = { ...it, [field]: value };
          if (field === 'currentReturn' || field === 'rate') {
            const currentQty = Number(updated.currentReturn) || 0;
            const rateVal = Number(updated.rate) || 0;
            updated.amount = Math.round(currentQty * rateVal * 100) / 100;
          }
          return updated;
        }
        return it;
      })
    );
  };

  // Toggle selection checkbox for one item
  const handleToggleItemSelect = (id: string) => {
    setFormItems(prev =>
      prev.map(it => it.id === id ? { ...it, selected: !it.selected } : it)
    );
  };

  // Toggle all items selection
  const handleToggleAllItems = () => {
    const allSelected = formItems.every(i => i.selected);
    setFormItems(prev => prev.map(i => ({ ...i, selected: !allSelected })));
  };

  // Add a manual item row to return form
  const handleAddProductRow = () => {
    const sampleProd = productsCatalog[0];
    const newItem: SalesReturnItem = {
      id: `manual-${Date.now()}`,
      productName: sampleProd ? sampleProd.name : 'Sample Return Item',
      code: sampleProd ? (sampleProd.code || sampleProd.barcode || sampleProd.sku || 'N/A') : 'MANUAL',
      invoiceNo: formSelectedInvoice || 'MANUAL',
      salesQty: 1,
      returnedQty: 0,
      currentReturn: 1,
      rate: sampleProd ? Number(sampleProd.retailPrice || sampleProd.price || 0) : 100,
      amount: sampleProd ? Number(sampleProd.retailPrice || sampleProd.price || 0) : 100,
      selected: true,
    };
    setFormItems(prev => [...prev, newItem]);
  };

  // Save Form
  const handleSave = async () => {
    if (!formReturnNo.trim()) {
      showToast('Return No is required', 'error');
      return;
    }

    const selectedReturnItems = formItems.filter(i => i.selected !== false);
    if (selectedReturnItems.length === 0) {
      showToast('Please select at least one item to return', 'error');
      return;
    }

    try {
      await withActionLock('sales_return_save', 1500, async () => {
        setIsSaving(true);
        const payload: Omit<SalesReturn, 'id' | 'createdAt' | 'updatedAt'> = {
          userId: user?.uid || '',
          companyId: userProfile?.companyId || user?.uid || '',
          companyName: userProfile?.displayName || 'Counter Store',
          returnNo: formReturnNo.trim(),
          invoiceNo: formSelectedInvoice || '',
          clientId: formClient.id,
          clientName: formClient.name || 'Walk-in Customer',
          customerPhone: formClient.phone || '',
          storeName: formStore,
          returnDate: formReturnDate,
          returnReason: formReturnReason,
          items: selectedReturnItems,
          amount: formReturnAmount,
          staff: formStaff,
          remarks: formReturnReason,
          isApproved: false,
          status: 'PENDING',
        };

        if (editingId) {
          await updateSalesReturn(editingId, payload);
          showToast('Retail return updated successfully', 'success');
        } else {
          await addSalesReturn(payload);
          showToast('Retail return created successfully', 'success');
        }

        await loadData();
        setViewMode('LIST');
        setEditingId(null);
      });
    } catch (err) {
      console.error('Error saving sales return:', err);
      showToast('Failed to save sales return', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Action
  const handleConfirmDelete = async () => {
    try {
      if (deleteModalState.mode === 'single' && deleteModalState.targetId) {
        await deleteSalesReturn(deleteModalState.targetId);
        showToast('Retail return deleted', 'success');
      } else if (deleteModalState.mode === 'bulk' && selectedIds.length > 0) {
        await deleteSalesReturnsBulk(selectedIds);
        showToast(`Deleted ${selectedIds.length} retail return(s)`, 'success');
        setSelectedIds([]);
      }
      setDeleteModalState({ isOpen: false, mode: 'single' });
      await loadData();
    } catch (err) {
      console.error('Error deleting sales return:', err);
      showToast('Failed to delete sales return', 'error');
    }
  };

  // Filtered and Paginated Returns
  const filteredReturns = useMemo(() => {
    return returns.filter(item => {
      if (storeFilter !== 'All' && item.storeName !== storeFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.returnNo?.toLowerCase().includes(q) ||
          item.clientName?.toLowerCase().includes(q) ||
          item.customerPhone?.toLowerCase().includes(q) ||
          item.storeName?.toLowerCase().includes(q) ||
          item.staff?.toLowerCase().includes(q) ||
          item.returnDate?.toLowerCase().includes(q) ||
          item.amount?.toString().includes(q)
        );
      }
      return true;
    });
  }, [returns, storeFilter, searchQuery]);

  const totalPages = Math.ceil(filteredReturns.length / pageSize) || 1;
  const paginatedReturns = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReturns.slice(start, start + pageSize);
  }, [filteredReturns, currentPage, pageSize]);

  // Checkbox handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === paginatedReturns.length && paginatedReturns.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedReturns.map(r => r.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Print helper
  const handlePrintReturn = (id: string) => {
    window.open(`/print/sales-return?id=${id}`, '_blank');
  };

  return (
    <>
      {viewMode === 'FORM' ? (
        <RetailReturnForm
          editingId={editingId}
          formSelectedInvoice={formSelectedInvoice}
          allInvoices={allInvoices}
          onSelectInvoice={handleSelectInvoice}
          formReturnDate={formReturnDate}
          setFormReturnDate={setFormReturnDate}
          formReturnNo={formReturnNo}
          setFormReturnNo={setFormReturnNo}
          formStore={formStore}
          setFormStore={setFormStore}
          storeOptions={storeOptions}
          formReturnReason={formReturnReason}
          setFormReturnReason={setFormReturnReason}
          formReturnAmount={formReturnAmount}
          formClient={formClient}
          formStaff={formStaff}
          setFormStaff={setFormStaff}
          formItems={formItems}
          onToggleAllItems={handleToggleAllItems}
          onToggleItemSelect={handleToggleItemSelect}
          onUpdateItem={handleUpdateItem}
          onAddProductRow={handleAddProductRow}
          isSaving={isSaving}
          onSave={handleSave}
          onGoBack={() => {
            setViewMode('LIST');
            setEditingId(null);
          }}
        />
      ) : (
        <RetailReturnTable
          storeFilter={storeFilter}
          setStoreFilter={setStoreFilter}
          storeOptions={storeOptions}
          onOpenAddForm={handleOpenAddForm}
          pageSize={pageSize}
          setPageSize={setPageSize}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          filteredReturns={filteredReturns}
          paginatedReturns={paginatedReturns}
          selectedIds={selectedIds}
          onToggleSelectAll={handleToggleSelectAll}
          onToggleSelectOne={handleToggleSelectOne}
          onOpenEditForm={handleOpenEditForm}
          onPrintReturn={handlePrintReturn}
          onOpenDeleteModal={(id, name) => {
            setDeleteModalState({
              isOpen: true,
              mode: 'single',
              targetId: id,
              targetName: name,
            });
          }}
          onOpenBulkDeleteModal={() => {
            if (selectedIds.length === 0) {
              showToast('Please select at least one record to delete', 'info');
              return;
            }
            setDeleteModalState({
              isOpen: true,
              mode: 'bulk',
              targetName: `${selectedIds.length} return record(s)`,
            });
          }}
          isLoading={isLoading}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        title={
          deleteModalState.mode === 'bulk'
            ? 'Delete Selected Retail Returns'
            : 'Delete Retail Return'
        }
        itemName={deleteModalState.targetName || 'this retail return'}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalState({ isOpen: false, mode: 'single' })}
      />
    </>
  );
};
