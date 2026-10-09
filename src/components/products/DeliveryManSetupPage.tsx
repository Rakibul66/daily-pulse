"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DeliveryMan } from '@/types/product';
import { 
  getDeliveryMen, 
  addDeliveryMan, 
  updateDeliveryMan, 
  deleteDeliveryMan, 
  deleteDeliveryMenBulk,
  DEFAULT_STORES 
} from '@/lib/deliveryStorage';
import { DeleteConfirmModal } from '../ui/DeleteConfirmModal';
import { DeliveryManFormData } from './delivery/types';
import { DeliveryManForm } from './delivery/DeliveryManForm';
import { DeliveryManTable } from './delivery/DeliveryManTable';

interface Props {
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const DeliveryManSetupPage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();
  const [deliveryMen, setDeliveryMen] = useState<DeliveryMan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // View Mode: 'LIST' or 'FORM'
  const [viewMode, setViewMode] = useState<'LIST' | 'FORM'>('LIST');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Editing & Deleting
  const [editingItem, setEditingItem] = useState<DeliveryMan | null>(null);
  const [deletingItem, setDeletingItem] = useState<DeliveryMan | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<DeliveryManFormData>({
    store: DEFAULT_STORES[0] || 'Shankhari Bazar',
    code: '',
    name: '',
    email: '',
    phone: '',
    nationalId: '',
    address: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, userProfile?.companyId]);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getDeliveryMen(user.uid, userProfile?.companyId);
      setDeliveryMen(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load delivery personnel', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Open Add Form
  const handleAddNew = () => {
    setEditingItem(null);
    const maxCode = deliveryMen.reduce((max, d) => {
      const num = parseInt(d.code, 10);
      return !isNaN(num) && num > max ? num : max;
    }, 0);
    const nextCode = String(maxCode + 1 || deliveryMen.length + 1 || 1);

    setFormData({
      store: DEFAULT_STORES[0] || 'Shankhari Bazar',
      code: nextCode,
      name: '',
      email: '',
      phone: '',
      nationalId: '',
      address: '',
      status: 'ACTIVE',
    });
    setViewMode('FORM');
  };

  // Open Edit Form
  const handleEdit = (item: DeliveryMan) => {
    setEditingItem(item);
    setFormData({
      store: item.store || DEFAULT_STORES[0],
      code: item.code || '',
      name: item.name || '',
      email: item.email || '',
      phone: item.phone || '',
      nationalId: item.nationalId || '',
      address: item.address || '',
      status: item.status || 'ACTIVE',
    });
    setViewMode('FORM');
  };

  const handleGoBack = () => {
    setViewMode('LIST');
    setEditingItem(null);
  };

  const handleSubmitForm = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter delivery man name', 'error');
      return;
    }
    if (!formData.code.trim()) {
      showToast('Please enter delivery code', 'error');
      return;
    }
    if (!user) return;

    setIsSubmitting(true);
    try {
      const payload: Omit<DeliveryMan, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: user.uid,
        companyId: userProfile?.companyId || user.uid,
        store: formData.store,
        code: formData.code.trim(),
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        nationalId: formData.nationalId.trim() || undefined,
        address: formData.address.trim() || undefined,
        status: formData.status,
      };

      if (editingItem) {
        await updateDeliveryMan(editingItem.id, payload);
        showToast('Delivery man updated successfully', 'success');
      } else {
        await addDeliveryMan(payload);
        showToast('Delivery man created successfully', 'success');
      }

      await loadData();
      setViewMode('LIST');
      setEditingItem(null);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error saving delivery man', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (item: DeliveryMan) => {
    const nextStatus = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await updateDeliveryMan(item.id, { status: nextStatus });
      setDeliveryMen(prev => prev.map(d => d.id === item.id ? { ...d, status: nextStatus } : d));
      showToast(`Marked as ${nextStatus}`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to update status', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    try {
      await deleteDeliveryMan(deletingItem.id);
      showToast('Delivery personnel deleted', 'success');
      setDeletingItem(null);
      setSelectedIds(prev => prev.filter(id => id !== deletingItem.id));
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete delivery man', 'error');
    }
  };

  const handleConfirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await deleteDeliveryMenBulk(selectedIds);
      showToast(`Deleted ${selectedIds.length} delivery personnel`, 'success');
      setSelectedIds([]);
      setIsBulkDeleting(false);
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete selected delivery men', 'error');
    }
  };

  // Filtered & Paginated
  const filteredItems = useMemo(() => {
    return deliveryMen.filter(d => {
      const matchSearch = 
        (d.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.store || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.code || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStatus = 
        statusFilter === 'ALL' || d.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [deliveryMen, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  const allSelectedOnPage = paginatedItems.length > 0 && paginatedItems.every(d => selectedIds.includes(d.id));

  const toggleSelectAll = () => {
    if (allSelectedOnPage) {
      const pageIds = new Set(paginatedItems.map(d => d.id));
      setSelectedIds(prev => prev.filter(id => !pageIds.has(id)));
    } else {
      const pageIds = paginatedItems.map(d => d.id);
      setSelectedIds(prev => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full">
      {viewMode === 'FORM' ? (
        <DeliveryManForm
          editingItem={editingItem}
          formData={formData}
          setFormData={setFormData}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmitForm}
          onCancel={handleGoBack}
        />
      ) : (
        <DeliveryManTable
          deliveryMen={deliveryMen}
          paginatedItems={paginatedItems}
          isLoading={isLoading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          pageSize={pageSize}
          setPageSize={setPageSize}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          totalFilteredCount={filteredItems.length}
          selectedIds={selectedIds}
          allSelectedOnPage={allSelectedOnPage}
          onToggleSelectAll={toggleSelectAll}
          onToggleSelectOne={toggleSelectOne}
          onToggleStatus={handleToggleStatus}
          onAddNew={handleAddNew}
          onEdit={handleEdit}
          onDeleteSingle={item => setDeletingItem(item)}
          onDeleteBulk={() => setIsBulkDeleting(true)}
        />
      )}

      {/* Single Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingItem}
        onCancel={() => setDeletingItem(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Delivery Man"
        itemName={deletingItem?.name || 'this delivery man'}
      />

      {/* Bulk Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={isBulkDeleting}
        onCancel={() => setIsBulkDeleting(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Delete Selected Personnel"
        itemName={`${selectedIds.length} selected delivery personnel`}
      />
    </div>
  );
};
