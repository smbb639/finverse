import { useQuery, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from './dashboard';

export const useDashboard = () => {
  const queryClient = useQueryClient();

  const dashboardQuery = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardService.getDashboardData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const quickStatsQuery = useQuery({
    queryKey: ['quick-stats'],
    queryFn: () => dashboardService.getQuickStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const refetchAll = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['quick-stats'] });
  };

  return {
    dashboard: dashboardQuery.data,
    quickStats: quickStatsQuery.data,
    isLoading: dashboardQuery.isLoading || quickStatsQuery.isLoading,
    isError: dashboardQuery.isError || quickStatsQuery.isError,
    refetchAll,
  };
};