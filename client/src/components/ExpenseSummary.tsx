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
  const BUDGET_AMOUNT = 1000000; // Budget set to 10 lakh rupees
  
  return (
    <Card className="bg-primary-50 shadow-md">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-gray-800">Total Expenses</h2>
          <div className="text-2xl font-bold text-primary-600">
            {formatCurrency(totalAmount)}
          </div>
        </div>
        
        <div className="text-sm text-gray-600 mb-3">
          Budget Limit: <span className="font-semibold">{formatCurrency(BUDGET_AMOUNT)}</span> (10 Lakh)
        </div>
        
        <div className="mt-2">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                budgetPercentage > 90 ? 'bg-red-500' : 
                budgetPercentage > 75 ? 'bg-orange-500' : 'bg-primary-500'
              }`} 
              style={{ width: `${budgetPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>{Math.round(budgetPercentage)}% used</span>
            <span>{budgetPercentage > 100 ? 'Over budget!' : `${(100 - budgetPercentage).toFixed(1)}% remaining`}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
