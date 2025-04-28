import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Budget } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { formatCurrency } from '../../utils/formatCurrency';

ChartJS.register(ArcElement, Tooltip, Legend);

interface BudgetSummaryProps {
  budget: Budget;
}

export const BudgetSummary: React.FC<BudgetSummaryProps> = ({ budget }) => {
  const totalAllocated = budget.categories.reduce((sum, cat) => sum + cat.allocated, 0);
  const totalSpent = budget.categories.reduce((sum, cat) => sum + cat.spent, 0);
  const remainingBudget = totalAllocated - totalSpent;
  const spentPercentage = Math.round((totalSpent / totalAllocated) * 100);

  const chartData = {
    labels: budget.categories.map(cat => cat.name.charAt(0).toUpperCase() + cat.name.slice(1)),
    datasets: [
      {
        data: budget.categories.map(cat => cat.allocated),
        backgroundColor: [
          '#3B82F6', // primary
          '#10B981', // secondary
          '#8B5CF6', // accent
          '#F59E0B', // warning
          '#6B7280', // gray
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${formatCurrency(value)}`;
          }
        }
      }
    },
    cutout: '65%',
    maintainAspectRatio: false,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Total Budget</p>
                <p className="text-2xl font-semibold">{formatCurrency(totalAllocated)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Spent</p>
                <p className="text-xl font-medium text-error-600">{formatCurrency(totalSpent)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Remaining</p>
                <p className="text-xl font-medium text-success-600">{formatCurrency(remainingBudget)}</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`absolute top-0 left-0 h-full ${
                    spentPercentage > 90 ? 'bg-error-500' : 
                    spentPercentage > 75 ? 'bg-warning-500' : 'bg-success-500'
                  }`}
                  style={{ width: `${spentPercentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{spentPercentage}% of budget used</p>
            </div>
          </div>
          <div className="h-60">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};