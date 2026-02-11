"use client";
import React, { useEffect, useState } from 'react';
import { Plus, Target } from 'lucide-react';
import { GoalCard } from '@/components/goals/GoalCard'; 
import { AddGoalModal } from '@/components/goals/AddGoalModal'; 
import { goalService, Goal } from '@/lib/goal'; 

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGoals = async () => {
    try {
      // 🟢 REPLACED: Raw fetch -> Service Call
      // (Auth header & Backend URL are handled automatically by axios)
      const data = await goalService.getGoals();
      setGoals(data);
    } catch (error) {
      console.error("Failed to fetch goals", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure you want to delete this goal?")) return;
    
    try {
      // 🟢 REPLACED: Raw fetch -> Service Call
      await goalService.deleteGoal(id);
      
      // Remove from UI immediately for speed, then refresh
      setGoals(prev => prev.filter(g => g._id !== id));
      fetchGoals(); 
    } catch (error) {
      console.error("Failed to delete goal", error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // Calculate Summary Stats
  const totalTarget = goals.reduce((acc, g) => acc + (g.targetAmount || 0), 0);
  const totalSaved = goals.reduce((acc, g) => acc + (g.currentAmount || 0), 0);

  return (
    <div className="p-8 min-h-screen bg-[#F8F9FC]"> 
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Goals</h1>
          <p className="text-gray-500 mt-1">Visualize your dreams and track your progress.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          <Plus size={20} /> New Goal
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-xl shadow-blue-200">
           <p className="text-blue-100 text-sm font-medium mb-1">Total Saved</p>
           <h2 className="text-3xl font-bold">₹{totalSaved.toLocaleString()}</h2>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
           <p className="text-gray-500 text-sm font-medium mb-1">Total Target</p>
           <h2 className="text-3xl font-bold text-gray-900">₹{totalTarget.toLocaleString()}</h2>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
           <p className="text-gray-500 text-sm font-medium mb-1">Active Goals</p>
           <h2 className="text-3xl font-bold text-gray-900">{goals.length}</h2>
        </div>
      </div>

      {/* Goals Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : goals.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="text-blue-500" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">No goals yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto mt-2">Create your first savings goal to get personalized insights on your progress.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <GoalCard key={goal._id} goal={goal} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <AddGoalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchGoals} 
      />
    </div>
  );
}