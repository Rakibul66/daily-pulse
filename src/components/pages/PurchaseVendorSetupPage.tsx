"use client";

import React, { useState } from "react";
import { Edit, Trash2, Plus, ArrowLeft, Check, Users } from "lucide-react";

interface Vendor {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  account: string;
  status: boolean;
}

export const PurchaseVendorSetupPage: React.FC<{ showToast: (msg: string, type?: "success" | "error") => void }> = ({ showToast }) => {
  const [vendors, setVendors] = useState<Vendor[]>([
    { id: "1", code: "300000000030", name: "3S Distributor", contactPerson: "", email: "", phone: "", address: "3S Distributor, Mirpur 1, Dhaka", account: "3S Distributor", status: true },
    { id: "2", code: "300000000029", name: "A.K TRADING CORPORATION", contactPerson: "", email: "", phone: "", address: "A.K TRADING CORPORATION, Tongi", account: "A.K TRADING CORPORATION", status: true },
    { id: "3", code: "300000000028", name: "Aarong Dairy", contactPerson: "", email: "", phone: "", address: "Aarong Dairy, Tejgaon, Dhaka", account: "Aarong Dairy", status: true },
    { id: "4", code: "300000000027", name: "Abul Khair Consumer Point", contactPerson: "", email: "", phone: "", address: "Abul Khair, Chattogram", account: "Abul Khair Consumer Point", status: true },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: ""
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      showToast("Please enter vendor code and name", "error");
      return;
    }
    const newVendor: Vendor = {
      id: Date.now().toString(),
      code: formData.code,
      name: formData.name,
      contactPerson: formData.contactPerson,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      account: formData.name,
      status: true,
    };
    setVendors([newVendor, ...vendors]);
    setFormData({ code: "", name: "", contactPerson: "", email: "", phone: "", address: "" });
    setShowAddForm(false);
    showToast("Vendor added successfully", "success");
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      setVendors(vendors.filter(v => v.id !== id));
      showToast("Vendor deleted", "success");
    }
  };

  if (showAddForm) {
    return (
      <div className="w-full mx-auto pb-20 px-2 sm:px-4">
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000]">
          <div className="flex justify-between items-center p-4 border-b-4 border-black bg-amber-300">
            <h2 className="text-black font-display font-black text-lg uppercase tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5" /> ADD NEW VENDOR
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowAddForm(false)} 
                className="px-4 py-2 bg-white text-black text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-slate-100 flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> GO BACK
              </button>
            </div>
          </div>
          <div className="p-6">
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-black uppercase text-black mb-1">Code <span className="text-red-500">*</span></label>
                <input type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full bg-white border-3 border-black p-2.5 text-sm font-bold text-black outline-none shadow-[2px_2px_0px_#000]" placeholder="Vendor Code" required />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-black mb-1">Vendor Name <span className="text-red-500">*</span></label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white border-3 border-black p-2.5 text-sm font-bold text-black outline-none shadow-[2px_2px_0px_#000]" placeholder="Vendor Name" required />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-black mb-1">Contact Person</label>
                <input type="text" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} className="w-full bg-white border-3 border-black p-2.5 text-sm font-bold text-black outline-none shadow-[2px_2px_0px_#000]" placeholder="Contact Person" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-black mb-1">Contact Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white border-3 border-black p-2.5 text-sm font-bold text-black outline-none shadow-[2px_2px_0px_#000]" placeholder="contact@vendor.com" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-black mb-1">Contact Number</label>
                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white border-3 border-black p-2.5 text-sm font-bold text-black outline-none shadow-[2px_2px_0px_#000]" placeholder="017XXXXXXXX" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-black mb-1">Address</label>
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-white border-3 border-black p-2.5 text-sm font-bold text-black outline-none shadow-[2px_2px_0px_#000]" placeholder="Vendor Address" />
              </div>
              <div className="md:col-span-3 flex justify-end mt-4">
                <button type="submit" className="px-6 py-3 bg-black hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000]">
                  SAVE VENDOR
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto pb-20 px-2 sm:px-4">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000]">
        <div className="flex justify-between items-center p-4 border-b-4 border-black bg-amber-300">
          <h2 className="text-black font-display font-black text-lg uppercase tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5" /> VENDOR SETUP & SUPPLIERS
          </h2>
          <button 
            onClick={() => setShowAddForm(true)} 
            className="px-4 py-2 bg-black hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> ADD NEW VENDOR
          </button>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto border-3 border-black shadow-[4px_4px_0px_#000]">
            <table className="w-full text-left text-sm text-black">
              <thead className="text-xs uppercase bg-black text-white font-black border-b-2 border-black">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Vendor Name</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black bg-white">
                {vendors.map((v) => (
                  <tr key={v.id} className="hover:bg-amber-50 font-bold">
                    <td className="px-4 py-3 font-mono text-xs">{v.code}</td>
                    <td className="px-4 py-3 font-black">{v.name}</td>
                    <td className="px-4 py-3 text-slate-700">{v.address}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-emerald-100 border border-black text-emerald-800 text-xs font-black">
                        ACTIVE
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => handleDelete(v.id)} className="p-1.5 text-black hover:text-rose-600 border border-black hover:bg-rose-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
