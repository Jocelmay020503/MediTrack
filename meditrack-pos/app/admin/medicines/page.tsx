'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Medicine {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  instructions: string;
  expiryDate: string;
}

const initialMedicines: Medicine[] = [
  { id: '1', name: 'Paracetamol 500mg', category: 'Pain Relief', price: 25.00, stock: 150, image: '/logo.PNG', instructions: 'Every 4 hours, take with meals', expiryDate: '2026-06-15' },
  { id: '2', name: 'Amoxicillin 250mg', category: 'Antibiotic', price: 85.00, stock: 80, image: '/logo.PNG', instructions: 'Every 8 hours, take with meals', expiryDate: '2026-05-20' },
  { id: '3', name: 'Ibuprofen 400mg', category: 'Pain Relief', price: 35.00, stock: 120, image: '/logo.PNG', instructions: 'Every 6 hours, take after meals', expiryDate: '2026-12-01' },
  { id: '4', name: 'Cetirizine 10mg', category: 'Allergy', price: 45.00, stock: 200, image: '/logo.PNG', instructions: 'Once daily, take at night', expiryDate: '2026-08-30' },
  { id: '5', name: 'Metformin 500mg', category: 'Diabetes', price: 120.00, stock: 60, image: '/logo.PNG', instructions: 'Twice daily, take with meals', expiryDate: '2026-03-15' },
  { id: '6', name: 'Omeprazole 20mg', category: 'Gastric', price: 65.00, stock: 90, image: '/logo.PNG', instructions: 'Once daily, before breakfast', expiryDate: '2026-11-20' },
  { id: '7', name: 'Salbutamol Inhaler', category: 'Respiratory', price: 150.00, stock: 40, image: '/logo.PNG', instructions: 'When needed, max 2 puffs', expiryDate: '2026-04-01' },
  { id: '8', name: 'Vitamin C 500mg', category: 'Supplements', price: 55.00, stock: 300, image: '/logo.PNG', instructions: 'Once daily, take with meals', expiryDate: '2027-01-15' },
];

const categories = ['Pain Relief', 'Antibiotic', 'Allergy', 'Diabetes', 'Gastric', 'Respiratory', 'Supplements', 'Other'];

export default function AdminMedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'stock'>('add');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [stockChange, setStockChange] = useState('');
  const [stockAction, setStockAction] = useState<'add' | 'reduce'>('add');
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    instructions: '',
    expiryDate: '',
  });

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setFormData({ name: '', category: '', price: '', stock: '', instructions: '', expiryDate: '' });
    setModalType('add');
    setShowModal(true);
  };

  const handleOpenEdit = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setFormData({
      name: medicine.name,
      category: medicine.category,
      price: medicine.price.toString(),
      stock: medicine.stock.toString(),
      instructions: medicine.instructions,
      expiryDate: medicine.expiryDate,
    });
    setModalType('edit');
    setShowModal(true);
  };

  const handleOpenStock = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setStockChange('');
    setStockAction('add');
    setModalType('stock');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (modalType === 'add') {
      const newMedicine: Medicine = {
        id: Date.now().toString(),
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        image: '/logo.PNG',
        instructions: formData.instructions,
        expiryDate: formData.expiryDate,
      };
      setMedicines([...medicines, newMedicine]);
    } else if (modalType === 'edit' && selectedMedicine) {
      setMedicines(medicines.map(med => 
        med.id === selectedMedicine.id
          ? {
              ...med,
              name: formData.name,
              category: formData.category,
              price: parseFloat(formData.price),
              stock: parseInt(formData.stock),
              instructions: formData.instructions,
              expiryDate: formData.expiryDate,
            }
          : med
      ));
    }
    
    setShowModal(false);
  };

  const handleStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedMedicine) {
      const change = parseInt(stockChange);
      const newStock = stockAction === 'add' 
        ? selectedMedicine.stock + change 
        : Math.max(0, selectedMedicine.stock - change);
      
      setMedicines(medicines.map(med =>
        med.id === selectedMedicine.id ? { ...med, stock: newStock } : med
      ));
    }
    
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this medicine?')) {
      setMedicines(medicines.filter(med => med.id !== id));
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Medicine Management</h1>
          <p className="text-slate-500">Add, edit, and manage medicine stock</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-4 rounded-lg transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Medicine
        </button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search medicines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Medicine</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Expiry</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMedicines.map((medicine) => (
                <tr key={medicine.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={medicine.image}
                        alt={medicine.name}
                        width={40}
                        height={40}
                        className="rounded object-contain bg-slate-100"
                      />
                      <div>
                        <p className="font-medium text-slate-800">{medicine.name}</p>
                        <p className="text-xs text-slate-500">{medicine.instructions.substring(0, 30)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                      {medicine.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">₱{medicine.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${
                      medicine.stock > 50 ? 'text-green-600' : 
                      medicine.stock > 20 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {medicine.stock} units
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{medicine.expiryDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenStock(medicine)}
                        className="p-1 text-slate-800 hover:bg-slate-100 rounded transition"
                        title="Add/Reduce Stock"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleOpenEdit(medicine)}
                        className="p-1 text-yellow-600 hover:bg-yellow-50 rounded transition"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(medicine.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-t-xl">
              <h2 className="text-lg font-semibold">
                {modalType === 'add' ? 'Add New Medicine' : 
                 modalType === 'edit' ? 'Edit Medicine' : 
                 'Manage Stock'}
              </h2>
              <button onClick={() => setShowModal(false)} className="hover:bg-white/10 p-1 rounded">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {modalType === 'stock' ? (
              <form onSubmit={handleStockSubmit} className="p-4">
                <div className="mb-4">
                  <p className="font-medium text-slate-800 mb-1">{selectedMedicine?.name}</p>
                  <p className="text-sm text-slate-500">Current Stock: {selectedMedicine?.stock} units</p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Action</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="stockAction"
                        checked={stockAction === 'add'}
                        onChange={() => setStockAction('add')}
                        className="text-slate-800"
                      />
                      <span className="text-sm">Add Stock</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="stockAction"
                        checked={stockAction === 'reduce'}
                        onChange={() => setStockAction('reduce')}
                        className="text-slate-800"
                      />
                      <span className="text-sm">Reduce Stock</span>
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {stockAction === 'add' ? 'Quantity to Add' : 'Quantity to Reduce'}
                  </label>
                  <input
                    type="number"
                    value={stockChange}
                    onChange={(e) => setStockChange(e.target.value)}
                    placeholder="Enter quantity"
                    min="1"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2 px-4 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-4 rounded-lg transition"
                  >
                    Confirm
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Medicine Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Price (₱)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Stock</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date</label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Instructions</label>
                  <textarea
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2 px-4 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-4 rounded-lg transition"
                  >
                    {modalType === 'add' ? 'Add Medicine' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
