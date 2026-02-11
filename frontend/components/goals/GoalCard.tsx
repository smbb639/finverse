import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Target, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { clsx } from 'clsx';
import { Goal } from '@/lib/goal'; // 🟢 Updated Import

interface GoalCardProps {
  goal: Goal;
  onDelete: (id: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onDelete }) => {
  // Determine status color based on insight keywords or progress
  const isDanger = goal.insight.includes("Increase savings") || goal.insight.includes("Deadline passed");
  const isSuccess = goal.insight.includes("Great pace") || goal.insight.includes("Achieved");
  
  const statusColor = isSuccess ? "bg-emerald-500" : isDanger ? "bg-rose-500" : "bg-blue-600";
  const statusLight = isSuccess ? "bg-emerald-50 text-emerald-700" : isDanger ? "bg-rose-50 text-rose-700" : "bg-blue-50 text-blue-700";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden group"
    >
      {/* Background decoration */}
      <div className={clsx("absolute top-0 right-0 w-32 h-32 opacity-5 rounded-full -mr-10 -mt-10 pointer-events-none", statusColor)} />

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{goal.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{goal.description || "Financial Goal"}</p>
        </div>
        <div className={clsx("p-2 rounded-full", statusLight)}>
            {isSuccess ? <TrendingUp size={20} /> : <Target size={20} />}
        </div>
      </div>

      {/* Money Stats */}
      <div className="flex items-end gap-2 mb-2">
        <span className="text-3xl font-bold text-gray-900">
          ₹{goal.currentAmount?.toLocaleString()}
        </span>
        <span className="text-sm text-gray-400 mb-2">
          / ₹{goal.targetAmount.toLocaleString()}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${goal.progressPercentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={clsx("h-full rounded-full", statusColor)}
        />
      </div>

      {/* The AI Insight Box */}
      <div className={clsx("rounded-xl p-3 flex gap-3 items-start text-sm mb-4", statusLight)}>
        {isDanger ? <AlertCircle size={18} className="shrink-0 mt-0.5" /> : <CheckCircle2 size={18} className="shrink-0 mt-0.5" />}
        <span className="font-medium leading-relaxed">{goal.insight}</span>
      </div>

      {/* Footer Meta */}
      <div className="flex justify-between items-center text-xs text-gray-400 pt-4 border-t border-gray-50 mt-auto">
        <div className="flex items-center gap-1.5">
          <Calendar size={14} />
          <span>Target: {format(new Date(goal.deadline), 'MMM dd, yyyy')}</span>
        </div>
        <div className="font-semibold text-gray-500">
          {Math.round(goal.progressPercentage)}% Done
        </div>
      </div>

       {/* Delete Action */}
       <button 
          onClick={() => onDelete(goal._id)}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg"
          title="Delete Goal"
       >
         <div className="sr-only">Delete</div>
         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
       </button>
    </motion.div>
  );
};