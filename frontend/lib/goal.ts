import api from './api'; // Ensure this points to your axios instance

export interface Goal {
  _id: string;
  user: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;     // Calculated by backend
  progressPercentage: number; // Calculated by backend
  insight: string;           // AI Generated text
  deadline: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GoalFormData {
  title: string;
  description?: string;
  targetAmount: number;
  deadline: string;
}

export const goalService = {
  async getGoals(): Promise<Goal[]> {
    const response = await api.get('/goals');
    // Note: If your backend sends res.json({ data: goals }), use response.data.data
    // If your backend sends res.json(goals), use response.data
    return response.data; 
  },

  // Add a new goal
  async addGoal(data: GoalFormData): Promise<Goal> {
    const response = await api.post('/goals', data);
    return response.data;
  },

  // Delete a goal
  async deleteGoal(id: string): Promise<void> {
    await api.delete(`/goals/${id}`);
  },

  // Update a goal (Optional, if you plan to add edit functionality later)
  async updateGoal(id: string, data: Partial<GoalFormData>): Promise<Goal> {
    const response = await api.put(`/goals/${id}`, data);
    return response.data;
  }
};