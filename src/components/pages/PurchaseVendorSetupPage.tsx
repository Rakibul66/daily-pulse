"use client";

import React, { useState } from "react";
import { Search, Edit, Trash2, Printer } from "lucide-react";

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([
    { id: "1", code: "V0122", name: "Mesas Naz Enterprise", contactPerson: "rakin", email: "01405594148", phone: "01781814878/01892108564", address: "", account: "Mesas Naz Enterprise", status: true },
    { id: "2", code: "V0121", name: "Mesas Brother Crokeries", contactPerson: "", email: "", phone: "01975009122/01999911982", address: "146-148 Mitford, Dhaka-1100", account: "Mesas Brother Crokeries", status: true },
    { id: "3", code: "V0120", name: "M/S MAA Enterprice", contactPerson: "maa", email: "01408296010", phone: "", address: "22/1 Dupkhola Dhaka 1100", account: "M/S MAA Enterprice", status: true },
    { id: "4", code: "V0119", name: "A.K TRADING CORPORATION", contactPerson: "AK TRADING", email: "", phone: "01915603765/01911886341", address: "57-58 Mitford Road, Dhaka", account: "A.K TRADING CORPORATION", status: true },
    { id: "5", code: "V0118", name: "Marico Distribution", contactPerson: "", email: "01710289602", phone: "", address: "94 Mirhajirbag, Dhaka", account: "Marico Distribution", status: true }
  ]);

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
      showToast("Code and Vendor Name are required", "error");
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

  if (showAddForm) {
    return (
      <div className="w-full mx-auto pb-10">
        <div className="bg-[#1a2332] rounded-md border border-slate-800 shadow-md">
          <div className="flex justify-between items-center p-4 border-b border-slate-800">
            <h2 className="text-white font-semibold">ADD NEW VENDOR</h2>
            <div className="flex gap-2">
              <button onClick={() => setShowAddForm(false)} className="px-4 py-1.5 bg-[#20b2aa] text-white text-xs font-bold rounded hover:bg-[#1a9a94]">GO BACK</button>
              <button onClick={handleSave} className="px-4 py-1.5 bg-[#20b2aa] text-white text-xs font-bold rounded hover:bg-[#1a9a94]">SAVE</button>
            </div>
          </div>
          <div className="p-6">
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs text-white mb-2">Code <span className="text-red-500">*</span></label>
                <input type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full bg-[#111827] border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-[#20b2aa]" placeholder="Code" />
              </div>
              <div>
                <label className="block text-xs text-white mb-2">Vendor Name <span className="text-red-500">*</span></label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#111827] border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-[#20b2aa]" placeholder="Vendor Name" />
              </div>
              <div>
                <label className="block text-xs text-white mb-2">Contact Person</label>
                <input type="text" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} className="w-full bg-[#111827] border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-[#20b2aa]" placeholder="Contact Person" />
              </div>
              <div>
                <label className="block text-xs text-white mb-2">Contact Email</label>
                <input type="text" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-[#111827] border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-[#20b2aa]" placeholder="Contact Email" />
              </div>
              <div>
                <label className="block text-xs text-white mb-2">Contact Number</label>
                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#111827] border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-[#20b2aa]" placeholder="Contact Number" />
              </div>
              <div>
                <label className="block text-xs text-white mb-2">Contact Address</label>
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-[#111827] border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-[#20b2aa]" placeholder="Contact Address" />
              </div>
            </form>
            <div className="flex justify-end mt-6">
              <button onClick={handleSave} className="px-6 py-2 bg-[#20b2aa] text-white text-xs font-bold rounded hover:bg-[#1a9a94]">SAVE</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto pb-10">
      <div className="bg-[#1a2332] rounded-md border border-slate-800 shadow-md">
        <div className="flex justify-between items-center p-4 border-b border-slate-800">
          <h2 className="text-white font-semibold uppercase">Vendor Setup</h2>
          <div className="flex items-center gap-3">
            <select className="bg-[#111827] text-white text-xs border border-slate-700 rounded px-2 py-1.5 focus:outline-none">
              <option>All</option>
            </select>
            <button onClick={() => setShowAddForm(true)} className="px-4 py-1.5 bg-[#20b2aa] text-white text-xs font-bold rounded hover:bg-[#1a9a94]">ADD NEW</button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center text-xs text-slate-300">
              Show 
              <select className="mx-2 bg-[#111827] border border-slate-700 rounded px-1 py-1">
                <option>10</option>
                <option>25</option>
              </select>
              entries
            </div>
            <div className="flex items-center text-xs text-slate-300">
              Search:
              <input type="text" className="ml-2 bg-[#111827] border border-slate-700 rounded px-2 py-1 text-white focus:outline-none" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-[#111827] border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="px-4 py-3 w-10"><input type="checkbox" className="rounded border-slate-700 bg-slate-800" /></th>
                  <th className="px-4 py-3 font-semibold">Code</th>
                  <th className="px-4 py-3 font-semibold">Vendor Name</th>
                  <th className="px-4 py-3 font-semibold">Contact Person</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Contact Number</th>
                  <th className="px-4 py-3 font-semibold">Address</th>
                  <th className="px-4 py-3 font-semibold">Account</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {vendors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3"><input type="checkbox" className="rounded border-slate-700 bg-slate-800" /></td>
                    <td className="px-4 py-3">{v.code}</td>
                    <td className="px-4 py-3 text-white">{v.name}</td>
                    <td className="px-4 py-3">{v.contactPerson}</td>
                    <td className="px-4 py-3">{v.email}</td>
                    <td className="px-4 py-3">{v.phone}</td>
                    <td className="px-4 py-3 max-w-[200px] truncate">{v.address}</td>
                    <td className="px-4 py-3">{v.account}</td>
                    <td className="px-4 py-3">
                      <div className={`w-10 h-5 rounded-full relative ${v.status ? 'bg-[#20b2aa]' : 'bg-slate-600'}`}>
                        <div className={`w-3.5 h-3.5 rounded-full bg-white dark:bg-slate-900 absolute top-[3px] transition-all ${v.status ? 'left-[22px]' : 'left-[4px]'}`}></div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1.5 bg-amber-500 text-white rounded hover:bg-amber-600"><Edit className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 bg-rose-500 text-white rounded hover:bg-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between items-center mt-4 text-xs text-slate-400">
            <div>Showing 1 to {vendors.length} of {vendors.length} entries</div>
            <div className="flex gap-1">
              <button className="px-2 py-1 bg-[#111827] border border-slate-700 rounded">&lt;</button>
              <button className="px-2 py-1 bg-[#20b2aa] text-white rounded">1</button>
              <button className="px-2 py-1 bg-[#111827] border border-slate-700 rounded">2</button>
              <button className="px-2 py-1 bg-[#111827] border border-slate-700 rounded">3</button>
              <button className="px-2 py-1 bg-[#111827] border border-slate-700 rounded">&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
