
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { TrustCircleContact } from '@/hooks/useTrustCircle';

interface AddContactModalProps {
  onClose: () => void;
  onAdd: (contact: Omit<TrustCircleContact, 'id'>) => void;
}

const AddContactModal: React.FC<AddContactModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    relationship: '',
    is_emergency_contact: false,
    is_sharing: false,
    priority: 1
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      user_id: '', // This will be set in the mutation
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="glass-card p-4 rounded-xl w-[90%] max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Add Contact</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Name (Required)</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                placeholder="Full Name"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-1">Phone (Required)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                placeholder="+1 (123) 456-7890"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                placeholder="email@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-1">Relationship</label>
              <input
                type="text"
                name="relationship"
                value={formData.relationship}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                placeholder="Family, Friend, etc."
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_emergency_contact"
                name="is_emergency_contact"
                checked={formData.is_emergency_contact}
                onChange={handleChange}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="is_emergency_contact" className="text-sm text-gray-300">
                Emergency Contact
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_sharing"
                name="is_sharing"
                checked={formData.is_sharing}
                onChange={handleChange}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="is_sharing" className="text-sm text-gray-300">
                Share Location
              </label>
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-1">Priority (1-5)</label>
              <input
                type="number"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                min="1"
                max="5"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white/10 rounded-lg text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-naari-purple rounded-lg text-white"
              >
                Add Contact
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContactModal;
