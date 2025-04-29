import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/expenseService";

interface ExpenseSummaryProps {
  totalAmount: number;
  budgetPercentage: number;
}

export default function ExpenseSummary({
  totalAmount,
  budgetPercentage
}: ExpenseSummaryProps) {
  const BUDGET_AMOUNT = 200; // Fixed budget for this application
  
  return (
    <Card className="bg-primary-50 shadow-md">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Total Expenses</h2>
          <div className="text-2xl font-bold text-primary-600">
            {formatCurrency(totalAmount)}
          </div>
        </div>
        
        <div className="mt-4">
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-primary-500 rounded-full" 
              style={{ width: `${budgetPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>0%</span>
            <span>Budget goal: {formatCurrency(BUDGET_AMOUNT)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
