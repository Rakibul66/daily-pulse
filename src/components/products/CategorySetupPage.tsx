"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ProductCategory } from '@/types/product';
import { 
  getProductCategories, 
  addProductCategory, 
  updateProductCategory, 
  deleteProductCategory, 
  deleteProductCategoriesBulk,
  DEFAULT_PRODUCT_CATEGORIES 
} from '@/lib/productStorage';
import { resizeImageFile } from '@/lib/imageUtils';
import { DeleteConfirmModal } from '../ui/DeleteConfirmModal';
import { CategoryFormData } from './category/types';
import { CategoryForm } from './category/CategoryForm';
import { CategoryTable } from './category/CategoryTable';

interface Props {
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const CategorySetupPage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // View state: 'LIST' or 'FORM'
  const [viewMode, setViewMode] = useState<'LIST' | 'FORM'>('LIST');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals & Active Edit
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<ProductCategory | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<CategoryFormData>({
    parentCategory: '',
    name: '',
    image: '',
    imageFileName: '',
    vendorNames: [],
    metaTitle: '',
    metaKeyword: '',
    metaDescription: '',
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
      const data = await getProductCategories(user.uid, userProfile?.companyId);
      setCategories(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load categories', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Open Form for Adding New Category
  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({
      parentCategory: '',
      name: '',
      image: '',
      imageFileName: '',
      vendorNames: [],
      metaTitle: '',
      metaKeyword: '',
      metaDescription: '',
      status: 'ACTIVE',
    });
    setViewMode('FORM');
  };

  // Open Form for Editing
  const handleEdit = (cat: ProductCategory) => {
    setEditingCategory(cat);
    setFormData({
      parentCategory: cat.parentCategory === 'None' ? '' : (cat.parentCategory || ''),
      name: cat.name || '',
      image: cat.image || '',
      imageFileName: cat.image ? 'Existing Image' : '',
      vendorNames: cat.vendorNames || [],
      metaTitle: cat.metaTitle || '',
      metaKeyword: cat.metaKeyword || '',
      metaDescription: cat.metaDescription || '',
      status: cat.status || 'ACTIVE',
    });
    setViewMode('FORM');
  };

  const handleGoBack = () => {
    setViewMode('LIST');
    setEditingCategory(null);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFileName: file.name }));
      try {
        const resizedUrl = await resizeImageFile(file, { maxWidth: 500, maxHeight: 500, quality: 0.85 });
        setFormData(prev => ({ ...prev, image: resizedUrl }));
      } catch (err: any) {
        showToast(err.message || 'Error processing image', 'error');
      }
    }
  };

  const handleToggleVendor = (vendorName: string) => {
    setFormData(prev => {
      const exists = prev.vendorNames.includes(vendorName);
      if (exists) {
        return { ...prev, vendorNames: prev.vendorNames.filter(v => v !== vendorName) };
      } else {
        return { ...prev, vendorNames: [...prev.vendorNames, vendorName] };
      }
    });
  };

  const handleSubmitForm = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter category name', 'error');
      return;
    }
    if (!user) return;

    setIsSubmitting(true);
    try {
      const payload: Omit<ProductCategory, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: user.uid,
        companyId: userProfile?.companyId || user.uid,
        companyName: userProfile?.displayName || 'Main Company',
        name: formData.name.trim(),
        parentCategory: formData.parentCategory.trim() || 'None',
        image: formData.image || undefined,
        vendorNames: formData.vendorNames,
        metaTitle: formData.metaTitle.trim() || undefined,
        metaKeyword: formData.metaKeyword.trim() || undefined,
        metaDescription: formData.metaDescription.trim() || undefined,
        status: formData.status,
      };

      if (editingCategory) {
        await updateProductCategory(editingCategory.id, payload);
        showToast('Category updated successfully', 'success');
      } else {
        await addProductCategory(payload);
        showToast('Category created successfully', 'success');
      }

      await loadData();
      setViewMode('LIST');
      setEditingCategory(null);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error saving category', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (cat: ProductCategory) => {
    const nextStatus = cat.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await updateProductCategory(cat.id, { status: nextStatus });
      setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, status: nextStatus } : c));
      showToast(`Category marked as ${nextStatus}`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to update status', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    try {
      await deleteProductCategory(deletingCategory.id);
      showToast('Category deleted successfully', 'success');
      setDeletingCategory(null);
      setSelectedIds(prev => prev.filter(id => id !== deletingCategory.id));
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete category', 'error');
    }
  };

  const handleConfirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await deleteProductCategoriesBulk(selectedIds);
      showToast(`Deleted ${selectedIds.length} categories`, 'success');
      setIsBulkDeleting(false);
      setSelectedIds([]);
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Bulk delete failed', 'error');
    }
  };

  // Filtered & Paginated List
  const filteredCategories = useMemo(() => {
    return categories.filter(c => {
      const matchesSearch = 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.parentCategory && c.parentCategory.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (!matchesSearch) return false;
      if (statusFilter === 'ACTIVE') return c.status === 'ACTIVE';
      if (statusFilter === 'INACTIVE') return c.status === 'INACTIVE';
      return true;
    });
  }, [categories, searchTerm, statusFilter]);

  const totalEntries = filteredCategories.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCategories.slice(start, start + pageSize);
  }, [filteredCategories, currentPage, pageSize]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedCategories.map(c => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isAllSelected = paginatedCategories.length > 0 && paginatedCategories.every(c => selectedIds.includes(c.id));

  // Rich parent categories options
  const parentCategoryOptions = useMemo(() => {
    const names = new Set<string>();
    
    categories
      .filter(c => !editingCategory || c.id !== editingCategory.id)
      .forEach(c => names.add(c.name));

    DEFAULT_PRODUCT_CATEGORIES
      .filter(c => !editingCategory || c.name !== editingCategory.name)
      .forEach(c => names.add(c.name));

    return Array.from(names).sort().map(name => ({ value: name, label: name }));
  }, [categories, editingCategory]);

  return (
    <div className="w-full">
      {viewMode === 'FORM' ? (
        <CategoryForm
          editingCategory={editingCategory}
          formData={formData}
          setFormData={setFormData}
          isSubmitting={isSubmitting}
          parentCategoryOptions={parentCategoryOptions}
          onImageChange={handleImageChange}
          onToggleVendor={handleToggleVendor}
          onSubmit={handleSubmitForm}
          onCancel={handleGoBack}
        />
      ) : (
        <CategoryTable
          categories={categories}
          paginatedCategories={paginatedCategories}
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
          totalEntries={totalEntries}
          selectedIds={selectedIds}
          isAllSelected={isAllSelected}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
          onToggleStatus={handleToggleStatus}
          onAddNew={handleAddNew}
          onEdit={handleEdit}
          onDelete={cat => setDeletingCategory(cat)}
          onBulkDelete={() => setIsBulkDeleting(true)}
        />
      )}

      {/* Delete Single Category Confirm Modal */}
      {deletingCategory && (
        <DeleteConfirmModal
          isOpen={true}
          title="Delete Category"
          itemName={`category "${deletingCategory.name}"`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingCategory(null)}
        />
      )}

      {/* Bulk Delete Confirm Modal */}
      {isBulkDeleting && (
        <DeleteConfirmModal
          isOpen={true}
          title="Bulk Delete Categories"
          itemName={`${selectedIds.length} categories`}
          onConfirm={handleConfirmBulkDelete}
          onCancel={() => setIsBulkDeleting(false)}
        />
      )}
    </div>
  );
};
