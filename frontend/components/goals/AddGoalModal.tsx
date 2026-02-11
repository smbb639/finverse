import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { goalService, GoalFormData } from '@/lib/goal'; // 🟢 Updated Import

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export const AddGoalModal = ({ isOpen, onClose, onRefresh }: AddGoalModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Initialize state
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '', // Kept as string for input handling, converted on submit
    deadline: '',
    description: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Prepare data for the service (convert string to number)
      const payload: GoalFormData = {
        title: formData.title,
        targetAmount: Number(formData.targetAmount),
        deadline: formData.deadline,
        description: formData.description
      };

      // 🟢 Use the Service
      await goalService.addGoal(payload);
      
      // Success!
      onRefresh();
      onClose();
      setFormData({ title: '', targetAmount: '', deadline: '', description: '' });
      
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create goal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">New Goal 🎯</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Goal Title</label>
            <input 
              required
              type="text" 
              placeholder="e.g. New Macbook"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount (₹)</label>
              <input 
                required
                type="number" 
                placeholder="50000"
                min="1"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.targetAmount}
                onChange={e => setFormData({...formData, targetAmount: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
              <input 
                required
                type="date" 
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.deadline}
                onChange={e => setFormData({...formData, deadline: e.target.value})}
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
             <textarea 
               rows={2}
               placeholder="Why are you saving for this?"
               className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
               value={formData.description}
               onChange={e => setFormData({...formData, description: e.target.value})}
             />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex justify-center items-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Create Goal"}
          </button>
        </form>
      </div>
    </div>
  );
};